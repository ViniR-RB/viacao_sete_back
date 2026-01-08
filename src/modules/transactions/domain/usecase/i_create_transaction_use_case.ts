import UseCase from '@/core/interface/use_case';
import TransactionEntity from '@/modules/transactions/domain/entities/transaction.entity';
import { TransactionType } from '@/modules/transactions/domain/types/transaction-type';

export interface CreateTransactionParam {
  userId: number;
  categoryId: string;
  description: string;
  amount: number | null;
  type: TransactionType;
  createdAt: Date | null;
  trasactionLineDetails: {
    amountGo: number;
    amountReturn: number;
    driveChange: number;
  } | null;
}

export class CreateTransactionResponse {
  constructor(public readonly transaction: TransactionEntity) {}

  fromResponse() {
    return this.transaction.toObject();
  }
}

export default interface ICreateTransactionUseCase
  extends UseCase<CreateTransactionParam, CreateTransactionResponse> {}
