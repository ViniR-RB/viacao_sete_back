import TransactionModel from '@/modules/transactions/infra/models/transaction.model';
import TransactionLineDetailsModel from '@/modules/transactions/infra/models/transaction_line_details.model';

export interface TransactionFindOneQueryOptions {
  selectFields?: (keyof TransactionModel)[];
  relations?: string[];
  transactionId?: string;
}

export interface TransactionLineDetailsFindOneQueryOptions {
  selectFields?: (keyof TransactionLineDetailsModel)[];
  relations?: string[];
  transactionLineDetailsId?: string;
}
