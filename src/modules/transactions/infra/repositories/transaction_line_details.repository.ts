import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import ITransactionLineDetailsRepository from '@/modules/transactions/adapters/i_transaction_line_details.repository';
import TransactionLineDetailsEntity from '@/modules/transactions/domain/entities/transaction_line_details.entity';
import TransactionLineDetailsRepositoryException from '@/modules/transactions/exceptions/transaction_line_details_repository.exception';
import TransactionLineDetailsMapper from '@/modules/transactions/infra/mapper/transaction_line_details.mapper';
import TransactionLineDetailsModel from '@/modules/transactions/infra/models/transaction_line_details.model';
import { EntityManager, Repository } from 'typeorm';

export default class TransactionLineDetailsRepository
  implements ITransactionLineDetailsRepository
{
  private readonly repository: Repository<TransactionLineDetailsModel>;
  constructor(
    repoOrManager: Repository<TransactionLineDetailsModel> | EntityManager,
  ) {
    if (repoOrManager instanceof Repository) {
      this.repository = repoOrManager;
    } else {
      this.repository = repoOrManager.getRepository(
        TransactionLineDetailsModel,
      );
    }
  }
  create(entity: TransactionLineDetailsEntity): TransactionLineDetailsModel {
    return this.repository.create(TransactionLineDetailsMapper.toModel(entity));
  }
  async save(
    entity: TransactionLineDetailsEntity,
  ): AsyncResult<AppException, TransactionLineDetailsEntity> {
    try {
      const model = this.create(entity);

      const savedModel = await this.repository.save(model);

      return right(TransactionLineDetailsMapper.toEntity(savedModel));
    } catch (error) {
      return left(
        new TransactionLineDetailsRepositoryException(
          ErrorMessages.UNEXPECTED_ERROR,
          500,
          error,
        ),
      );
    }
  }
}
