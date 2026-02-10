import TransactionModel from '@/modules/transactions/infra/models/transaction.model';

export interface TransactionFindOneQueryOptions {
  selectFields?: (keyof TransactionModel)[];
  relations?: string[];
  transactionId?: string;
}
