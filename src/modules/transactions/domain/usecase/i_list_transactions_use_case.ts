import UseCase from '@/core/interface/use_case';
import PageEntity from '@/modules/pagination/domain/entities/page.entity';
import PageOptionsEntity from '@/modules/pagination/domain/entities/page_options.entity';
import TransactionEntity from '@/modules/transactions/domain/entities/transaction.entity';
import { TransactionType } from '@/modules/transactions/domain/types/transaction-type';

export interface ListTransactionsParam {
  userId: number;
  options: PageOptionsEntity;
  type?: TransactionType;
  categoryId?: string;
  startDate?: Date;
  endDate?: Date;
}

export class ListTransactionsResponse {
  constructor(public readonly transactionPage: PageEntity<TransactionEntity>) {}

  fromResponse() {
    return this.transactionPage.toObject();
  }
}

export default interface IListTransactionsUseCase
  extends UseCase<ListTransactionsParam, ListTransactionsResponse> {}
