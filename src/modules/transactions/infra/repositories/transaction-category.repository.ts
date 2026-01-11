import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import PageEntity from '@/modules/pagination/domain/entities/page.entity';
import PageMetaEntity from '@/modules/pagination/domain/entities/page_meta.entity';
import PageOptionsEntity from '@/modules/pagination/domain/entities/page_options.entity';
import ITransactionCategoryRepository from '@/modules/transactions/adapters/i_transaction_category.repository';
import TransactionCategoryEntity from '@/modules/transactions/domain/entities/transaction-category.entity';
import TransactionCategoryType from '@/modules/transactions/domain/entities/transaction_category_enum';
import TransactionCategoryRespositoryException from '@/modules/transactions/exceptions/transaction_category_repository.exception';
import TransactionCategoryMapper from '@/modules/transactions/infra/mapper/transaction-category.mapper';
import TransactionCategoryModel from '@/modules/transactions/infra/models/transaction-category.model';
import { Repository } from 'typeorm';

export default class TransactionCategoryRepository
  implements ITransactionCategoryRepository
{
  constructor(
    private readonly repository: Repository<TransactionCategoryModel>,
  ) {}
  create(entity: TransactionCategoryEntity): TransactionCategoryModel {
    return this.repository.create(TransactionCategoryMapper.toModel(entity));
  }
  async save(
    entity: TransactionCategoryEntity,
  ): AsyncResult<AppException, TransactionCategoryEntity> {
    try {
      const model = this.create(entity);
      const savedModel = await this.repository.save(model);
      const entityResult = TransactionCategoryMapper.toEntity(savedModel);

      return right(entityResult);
    } catch (error) {
      return left(
        new TransactionCategoryRespositoryException(
          ErrorMessages.UNEXPECTED_ERROR,
          500,
          error,
        ),
      );
    }
  }

  async findOneById(
    id: string,
  ): AsyncResult<AppException, TransactionCategoryEntity> {
    try {
      const model = await this.repository.findOne({
        where: { id },
      });

      if (!model) {
        return left(TransactionCategoryRespositoryException.notFound(id));
      }

      const entity = TransactionCategoryMapper.toEntity(model);

      return right(entity);
    } catch (error) {
      return left(
        new TransactionCategoryRespositoryException(
          ErrorMessages.UNEXPECTED_ERROR,
        ),
      );
    }
  }

  async findByName(
    name: string,
  ): AsyncResult<AppException, TransactionCategoryEntity> {
    try {
      const model = await this.repository.findOne({
        where: { name },
      });

      if (!model) {
        return left(TransactionCategoryRespositoryException.notFound());
      }

      const entity = TransactionCategoryMapper.toEntity(model);

      return right(entity);
    } catch (error) {
      return left(
        new TransactionCategoryRespositoryException(
          ErrorMessages.UNEXPECTED_ERROR,
          500,
          error,
        ),
      );
    }
  }

  async findByFiltersPagination(
    options: PageOptionsEntity,
    name?: string,
    type?: TransactionCategoryType,
  ): AsyncResult<AppException, PageEntity<TransactionCategoryEntity>> {
    try {
      const skip = options.skip;
      const take = options.take;

      const queryBuilder = this.repository
        .createQueryBuilder('tc')
        .orderBy('tc.createdAt', options.order);

      if (name) {
        queryBuilder.where('tc.name ILIKE :name', { name: `%${name}%` });
      }

      if (type) {
        queryBuilder.andWhere('tc.types ILIKE :type', { type: `%${type}%` });
      }

      const [models, total] = await queryBuilder
        .skip(skip)
        .take(take)
        .getManyAndCount();

      const entities = models.map(model =>
        TransactionCategoryMapper.toEntity(model),
      );

      const pageMetaEntity = new PageMetaEntity({
        pageOptions: options,
        itemCount: total,
      });

      const pageEntity = new PageEntity(entities, pageMetaEntity);

      return right(pageEntity);
    } catch (error) {
      return left(
        new TransactionCategoryRespositoryException(
          ErrorMessages.UNEXPECTED_ERROR,
          500,
          error,
        ),
      );
    }
  }
}
