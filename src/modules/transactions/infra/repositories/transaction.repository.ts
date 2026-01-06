import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import PageEntity from '@/modules/pagination/domain/entities/page.entity';
import PageMetaEntity from '@/modules/pagination/domain/entities/page_meta.entity';
import ITransactionRepository, {
  TransactionQueryOptions,
} from '@/modules/transactions/adapters/i_transaction.repository';
import TransactionEntity from '@/modules/transactions/domain/entities/transaction.entity';
import TransactionRepositoryException from '@/modules/transactions/exceptions/transaction_repository.exception';
import TransactionMapper from '@/modules/transactions/infra/mapper/transaction.mapper';
import TransactionModel from '@/modules/transactions/infra/models/transaction.model';
import TransactionWithCategoryReadModel from '@/modules/transactions/infra/read-models/transaction_with_category_read_model';
import { Repository } from 'typeorm';

export default class TransactionRepository implements ITransactionRepository {
  constructor(private readonly repository: Repository<TransactionModel>) {}
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
        .addSelect(['c.name', 'c.description']);

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
        .orderBy('t.createdAt', 'DESC')
        .skip(skip)
        .take(take)
        .getManyAndCount();

      const entities = models.map(model =>
        TransactionMapper.toReadModelWithCategory(model),
      );

      const pageMetaEntity = new PageMetaEntity({
        pageOptions: query.options,
        itemCount: total,
      });

      const pageEntity = new PageEntity(entities, pageMetaEntity);

      return right(pageEntity);
    } catch (error) {
      return left(
        new TransactionRepositoryException(ErrorMessages.UNEXPECTED_ERROR),
      );
    }
  }

  async findOneById(id: string): AsyncResult<AppException, TransactionEntity> {
    try {
      const model = await this.repository.findOne({
        where: { id },
      });

      if (!model) {
        return left(TransactionRepositoryException.notFound(id));
      }

      const entity = TransactionMapper.toEntity(model);

      return right(entity);
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
}
