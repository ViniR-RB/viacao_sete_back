import UseCase from '@/core/interface/use_case';
import TransactionEntity from '@/modules/transactions/domain/entities/transaction.entity';
import { TransactionType } from '@/modules/transactions/domain/types/transaction-type';

export interface UpdateTransactionParam {
  id: string;
  description?: string;
  type?: TransactionType;
  amount?: number | null;
  splitPayments?: {
    id?: string;
    paymentMethodId: string;
    amount: number;
  }[];
  categoryId?: string;
  createdAt?: Date;
  transactionLineDetails?: {
    amountGo: number;
    amountReturn: number;
    driveChange: number;
  } | null;
}

export class UpdateTransactionResponse {
  constructor(public readonly transaction: TransactionEntity) {}

  fromResponse() {
    return this.transaction.toObject();
  }
}

export default interface IUpdateTransactionUseCase
  extends UseCase<UpdateTransactionParam, UpdateTransactionResponse> {}
