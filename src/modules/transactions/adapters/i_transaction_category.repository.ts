import AppException from '@/core/exceptions/app_exception';
import BaseRepository from '@/core/interface/base.repository';
import AsyncResult from '@/core/types/async_result';
import PageEntity from '@/modules/pagination/domain/entities/page.entity';
import PageOptionsEntity from '@/modules/pagination/domain/entities/page_options.entity';
import TransactionCategoryEntity from '@/modules/transactions/domain/entities/transaction-category.entity';
import TransactionCategoryModel from '@/modules/transactions/infra/models/transaction-category.model';

export default interface ITransactionCategoryRepository
  extends BaseRepository<TransactionCategoryEntity, TransactionCategoryModel> {
  findOneById(id: string): AsyncResult<AppException, TransactionCategoryEntity>;
  findByName(
    name: string,
  ): AsyncResult<AppException, TransactionCategoryEntity>;
  findByFiltersPagination(
    options: PageOptionsEntity,
    name?: string,
  ): AsyncResult<AppException, PageEntity<TransactionCategoryEntity>>;
}
