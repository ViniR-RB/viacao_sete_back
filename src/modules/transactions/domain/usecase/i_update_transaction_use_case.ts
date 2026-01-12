import UseCase from '@/core/interface/use_case';
import TransactionEntity from '@/modules/transactions/domain/entities/transaction.entity';
import TransactionLineDetailsEntity from '@/modules/transactions/domain/entities/transaction_line_details.entity';
import { CreateTransactionParam } from '@/modules/transactions/domain/usecase/i_create_transaction_use_case';

export interface UpdateTransactionParam extends CreateTransactionParam {
  id: string;
}

export class UpdateTransactionResponse {
  constructor(
    public readonly transaction: TransactionEntity,
    public readonly transactionLineDetails: TransactionLineDetailsEntity | null,
  ) {}

  fromResponse() {
    return {
      transaction: this.transaction,
      transactionLineDetails: this.transactionLineDetails,
    };
  }
}

export default interface IUpdateTransactionUseCase
  extends UseCase<UpdateTransactionParam, UpdateTransactionResponse> {}
