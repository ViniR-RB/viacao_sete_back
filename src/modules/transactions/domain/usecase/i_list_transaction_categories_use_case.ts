import UseCase from '@/core/interface/use_case';
import PageEntity from '@/modules/pagination/domain/entities/page.entity';
import PageOptionsEntity from '@/modules/pagination/domain/entities/page_options.entity';
import TransactionCategoryEntity from '@/modules/transactions/domain/entities/transaction-category.entity';

export interface ListTransactionCategoriesParam {
  options: PageOptionsEntity;
  name?: string;
}

export class ListTransactionCategoriesResponse {
  constructor(
    public readonly categoryPage: PageEntity<TransactionCategoryEntity>,
  ) {}

  fromResponse() {
    return this.categoryPage.toObject();
  }
}

export default interface IListTransactionCategoriesUseCase
  extends UseCase<
    ListTransactionCategoriesParam,
    ListTransactionCategoriesResponse
  > {}
