import AppException from '@/core/exceptions/app_exception';
import BaseRepository from '@/core/interface/base.repository';
import AsyncResult from '@/core/types/async_result';
import PageEntity from '@/modules/pagination/domain/entities/page.entity';
import PageOptionsEntity from '@/modules/pagination/domain/entities/page_options.entity';
import TransactionEntity from '@/modules/transactions/domain/entities/transaction.entity';
import TransactionModel from '@/modules/transactions/infra/models/transaction.model';

export interface TransactionQueryOptions {
  userId: number;
  options: PageOptionsEntity;
  categoryId?: string;
  type?: string;
  startDate?: Date;
  endDate?: Date;
}

export default interface ITransactionRepository
  extends BaseRepository<TransactionEntity, TransactionModel> {
  findByFiltersPagination(
    query: TransactionQueryOptions,
  ): AsyncResult<AppException, PageEntity<TransactionEntity>>;
  findOneById(id: string): AsyncResult<AppException, TransactionEntity>;
}
