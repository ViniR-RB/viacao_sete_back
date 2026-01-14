import UseCase from '@/core/interface/use_case';
import TransactionCategoryEntity from '@/modules/transactions/domain/entities/transaction-category.entity';

export interface UpdateTransactionCategoryParam {
  id: string;
  userId: number;
  name: string;
  description: string | null;
}

export class UpdateTransactionCategoryResponse {
  constructor(public readonly transactionCategory: TransactionCategoryEntity) {}

  fromResponse() {
    return this.transactionCategory.toObject();
  }
}

export default interface IUpdateTransactionCategoryUseCase
  extends UseCase<
    UpdateTransactionCategoryParam,
    UpdateTransactionCategoryResponse
  > {}
