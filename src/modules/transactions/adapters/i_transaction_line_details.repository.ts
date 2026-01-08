import BaseRepository from '@/core/interface/base.repository';
import TransactionLineDetailsEntity from '@/modules/transactions/domain/entities/transaction_line_details.entity';
import TransactionLineDetailsModel from '@/modules/transactions/infra/models/transaction_line_details.model';

export default interface ITransactionLineDetailsRepository
  extends BaseRepository<
    TransactionLineDetailsEntity,
    TransactionLineDetailsModel
  > {}
