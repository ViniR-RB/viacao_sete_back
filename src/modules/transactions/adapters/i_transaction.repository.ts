import AppException from '@/core/exceptions/app_exception';
import BaseRepository from '@/core/interface/base.repository';
import AsyncResult from '@/core/types/async_result';
import PageEntity from '@/modules/pagination/domain/entities/page.entity';
import PageOptionsEntity from '@/modules/pagination/domain/entities/page_options.entity';
import TransactionEntity from '@/modules/transactions/domain/entities/transaction.entity';
import TransactionModel from '@/modules/transactions/infra/models/transaction.model';
import TransactionWithCategoryReadModel from '@/modules/transactions/infra/read-models/transaction_with_category_read_model';

export interface TransactionQueryOptions {
  userId: number;
  options: PageOptionsEntity;
  categoryId?: string;
  type?: string;
  startDate?: Date;
  endDate?: Date;
}

export enum TransactionPeriod {
  TWELVE_MONTHS = 'TWELVE_MONTHS',
  LAST_30_DAYS = 'LAST_30_DAYS',
}

export interface TransactionPeriodQueryOptions {
  period: TransactionPeriod;
}

export default interface ITransactionRepository
  extends BaseRepository<TransactionEntity, TransactionModel> {
  findByFiltersPagination(
    query: TransactionQueryOptions,
  ): AsyncResult<AppException, PageEntity<TransactionWithCategoryReadModel>>;
  findOneById(id: string): AsyncResult<AppException, TransactionEntity>;
  findByPeriod(
    query: TransactionPeriodQueryOptions,
  ): AsyncResult<AppException, TransactionEntity[]>;
}
