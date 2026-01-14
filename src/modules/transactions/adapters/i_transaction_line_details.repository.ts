import AppException from '@/core/exceptions/app_exception';
import BaseRepository from '@/core/interface/base.repository';
import AsyncResult from '@/core/types/async_result';
import { TransactionLineDetailsFindOneQueryOptions } from '@/modules/transactions/adapters/query/query_options';
import TransactionLineDetailsEntity from '@/modules/transactions/domain/entities/transaction_line_details.entity';
import TransactionLineDetailsModel from '@/modules/transactions/infra/models/transaction_line_details.model';

export default interface ITransactionLineDetailsRepository
  extends BaseRepository<
    TransactionLineDetailsEntity,
    TransactionLineDetailsModel
  > {
  findOne(
    query: TransactionLineDetailsFindOneQueryOptions,
  ): AsyncResult<AppException, TransactionLineDetailsEntity>;
}
