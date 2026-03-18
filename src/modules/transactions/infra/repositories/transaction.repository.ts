import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import Unit, { unit } from '@/core/types/unit';
import { Amount } from '@/core/value-objects/amount';
import PageEntity from '@/modules/pagination/domain/entities/page.entity';
import PageMetaEntity from '@/modules/pagination/domain/entities/page_meta.entity';
import ITransactionRepository, {
  TransactionPeriod,
  TransactionPeriodQueryOptions,
  TransactionQueryOptions,
} from '@/modules/transactions/adapters/i_transaction.repository';
import { TransactionFindOneQueryOptions } from '@/modules/transactions/adapters/query/query_options';
import TransactionEntity from '@/modules/transactions/domain/entities/transaction.entity';
import TransactionRepositoryException from '@/modules/transactions/exceptions/transaction_repository.exception';
import TransactionMapper from '@/modules/transactions/infra/mapper/transaction.mapper';
import TransactionModel from '@/modules/transactions/infra/models/transaction.model';
import TransactionForReportReadModel from '@/modules/transactions/infra/read-models/transaction_for_report_read_model';
import TransactionWithCategoryReadModel from '@/modules/transactions/infra/read-models/transaction_with_category_read_model';
import TransactionWithTypeCreatedAndAmount from '@/modules/transactions/infra/read-models/transaction_with_type_created_and_amount';
import {
  EntityManager,
  EntityNotFoundError,
  FindOneOptions,
  Repository,
} from 'typeorm';

export default class TransactionRepository implements ITransactionRepository {
  private readonly repository: Repository<TransactionModel>;
  constructor(repoOrManager: Repository<TransactionModel> | EntityManager) {
    if (repoOrManager instanceof Repository) {
      this.repository = repoOrManager;
    } else {
      this.repository = repoOrManager.getRepository(TransactionModel);
    }
  }
  async deleteSplitPaymentsByIds(
    ids: string[],
  ): AsyncResult<AppException, Unit> {
    try {
      await this.repository
        .createQueryBuilder()
        .delete()
        .from('split_payments')
        .where('id IN (:...ids)', { ids })
        .execute();
      return right(unit);
    } catch (error) {
      return left(
        new TransactionRepositoryException(
          ErrorMessages.UNEXPECTED_ERROR,
          500,
          error,
        ),
      );
    }
  }

  create(entity: TransactionEntity): TransactionModel {
    return this.repository.create(TransactionMapper.toModel(entity));
  }

  async save(
    entity: TransactionEntity,
  ): AsyncResult<AppException, TransactionEntity> {
    try {
      const model = this.create(entity);
      const entityResult = await this.repository.save(model);

      return right(TransactionMapper.toEntity(entityResult));
    } catch (error) {
      return left(
        new TransactionRepositoryException(
          ErrorMessages.UNEXPECTED_ERROR,
          500,
          error,
        ),
      );
    }
  }

  async findByFiltersPagination(
    query: TransactionQueryOptions,
  ): AsyncResult<AppException, PageEntity<TransactionWithCategoryReadModel>> {
    try {
      let queryBuilder = this.repository
        .createQueryBuilder('t')
        .where('t.userId = :userId', {
          userId: query.userId,
        })
        .leftJoin('t.category', 'c')
        .addSelect(['c.name', 'c.description', 'c.id'])
        .leftJoin('t.transactionLineDetails', 'tld')
        .addSelect([
          'tld.id',
          'tld.amountGo',
          'tld.amountReturn',
          'tld.driveChange',
        ])
        .leftJoinAndSelect('t.splitPayments', 'tsp');

      if (query.type) {
        queryBuilder = queryBuilder.andWhere('t.type = :type', {
          type: query.type,
        });
      }

      if (query.categoryId) {
        queryBuilder = queryBuilder.andWhere('t.categoryId = :categoryId', {
          categoryId: query.categoryId,
        });
      }

      if (query.startDate && query.endDate) {
        queryBuilder = queryBuilder.andWhere(
          't.createdAt BETWEEN :startDate AND :endDate',
          {
            startDate: query.startDate,
            endDate: query.endDate,
          },
        );
      } else if (query.startDate) {
        queryBuilder = queryBuilder.andWhere('t.createdAt >= :startDate', {
          startDate: query.startDate,
        });
      } else if (query.endDate) {
        queryBuilder = queryBuilder.andWhere('t.createdAt <= :endDate', {
          endDate: query.endDate,
        });
      }

      const skip = (query.options.page - 1) * query.options.take;
      const take = query.options.take;
      const [models, total] = await queryBuilder
        .orderBy('t.createdAt', query.options.order)
        .skip(skip)
        .take(take)
        .getManyAndCount();

      const entities = models.map(TransactionMapper.toReadModelWithCategory);

      const pageMetaEntity = new PageMetaEntity({
        pageOptions: query.options,
        itemCount: total,
      });

      const pageEntity = new PageEntity(entities, pageMetaEntity);

      return right(pageEntity);
    } catch (error) {
      return left(
        new TransactionRepositoryException(
          ErrorMessages.UNEXPECTED_ERROR,
          500,
          error,
        ),
      );
    }
  }

  async findOne(
    query: TransactionFindOneQueryOptions,
  ): AsyncResult<AppException, TransactionEntity> {
    try {
      let options: FindOneOptions<TransactionModel> = {
        select: query.selectFields,
        relations: query.relations,
      };

      if (query.transactionId) {
        options = {
          ...options,
          where: { id: query.transactionId },
        };
      }

      const transactionLineDetailsFinder =
        await this.repository.findOneOrFail(options);

      const entity = TransactionMapper.toEntity(transactionLineDetailsFinder);

      return right(entity);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        return left(
          TransactionRepositoryException.notFound(query.transactionId),
        );
      }
      return left(
        new TransactionRepositoryException(
          ErrorMessages.UNEXPECTED_ERROR,
          500,
          error,
        ),
      );
    }
  }

  async findByPeriod(
    query: TransactionPeriodQueryOptions,
  ): AsyncResult<AppException, TransactionWithTypeCreatedAndAmount[]> {
    try {
      const { startDate, endDate } = this.calculatePeriodBoundaries(
        query.period,
      );

      let queryBuilder = this.repository
        .createQueryBuilder('t')
        .where('t.createdAt BETWEEN :startDate AND :endDate', {
          startDate,
          endDate,
        })
        .select(['t.amount', 't.type', 't.createdAt'])
        .orderBy('t.createdAt', 'DESC');

      const models = await queryBuilder.getMany();

      const entities: TransactionWithTypeCreatedAndAmount[] = models.map(
        model => ({
          amount: Amount.from(model.amount),
          type: model.type,
          createdAt: model.createdAt,
        }),
      );

      return right(entities);
    } catch (error) {
      return left(
        new TransactionRepositoryException(
          ErrorMessages.UNEXPECTED_ERROR,
          500,
          error,
        ),
      );
    }
  }

  async delete(entity: TransactionEntity): AsyncResult<AppException, void> {
    try {
      await this.repository.delete(entity.id);
      return right(undefined);
    } catch (error) {
      return left(
        new TransactionRepositoryException(
          ErrorMessages.UNEXPECTED_ERROR,
          500,
          error,
        ),
      );
    }
  }

  async findByFiltersForReport(query: {
    startDate: Date;
    endDate: Date;
    categoryIds: string[];
  }): AsyncResult<AppException, TransactionForReportReadModel[]> {
    const { startDate, endDate, categoryIds } = query;
    try {
      let queryBuilder = this.repository
        .createQueryBuilder('t')
        .addSelect([
          't.id',
          't.amount',
          't.createdAt',
          't.type',
          't.description',
        ]);

      if (categoryIds && categoryIds.length > 0) {
        queryBuilder = queryBuilder.andWhere(
          't.categoryId IN (:...categoryIds)',
          {
            categoryIds,
          },
        );
      }

      if (startDate && endDate) {
        queryBuilder = queryBuilder.andWhere(
          't.createdAt BETWEEN :startDate AND :endDate',
          {
            startDate,
            endDate,
          },
        );
      } else if (startDate) {
        queryBuilder = queryBuilder.andWhere('t.createdAt >= :startDate', {
          startDate,
        });
      } else if (endDate) {
        queryBuilder = queryBuilder.andWhere('t.createdAt <= :endDate', {
          endDate,
        });
      }
      queryBuilder = queryBuilder
        .leftJoin('t.category', 'category')
        .addSelect(['category.name']);

      const models = await queryBuilder.orderBy('t.createdAt', 'ASC').getMany();

      const entities: TransactionForReportReadModel[] = models.map(m => {
        return {
          description: m.description,
          amount: Amount.from(m.amount),
          createdAt: m.createdAt,
          id: m.id,
          type: m.type,
          categoryName: m.category.name,
        };
      });

      return right(entities);
    } catch (error) {
      return left(
        new TransactionRepositoryException(
          ErrorMessages.UNEXPECTED_ERROR,
          500,
          error,
        ),
      );
    }
  }

  /**
   * Calculate date boundaries based on period
   * TWELVE_MONTHS: From the 1st day of 12 months ago to the last day of current month
   * LAST_30_DAYS: From 30 days ago to today
   */
  private calculatePeriodBoundaries(period: TransactionPeriod): {
    startDate: Date;
    endDate: Date;
  } {
    const today = new Date();

    if (period === TransactionPeriod.TWELVE_MONTHS) {
      // End date: last day of current month
      const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      endDate.setHours(23, 59, 59, 999);

      // Start date: 1st day of 12 months ago
      const startDate = new Date(today.getFullYear() - 1, today.getMonth(), 1);
      startDate.setHours(0, 0, 0, 0);

      return { startDate, endDate };
    } else if (period === TransactionPeriod.LAST_30_DAYS) {
      // End date: today (end of day)
      const endDate = new Date(today);
      endDate.setHours(23, 59, 59, 999);

      // Start date: 30 days ago
      const startDate = new Date(today);
      startDate.setDate(startDate.getDate() - 30);
      startDate.setHours(0, 0, 0, 0);

      return { startDate, endDate };
    }

    // Default fallback
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    startDate.setHours(0, 0, 0, 0);

    return { startDate, endDate };
  }
}
