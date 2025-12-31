import UseCase from '@/core/interface/use_case';
import TransactionCategoryEntity from '@/modules/transactions/domain/entities/transaction-category.entity';

export interface CreateTransactionCategoryParam {
  userId: number;
  name: string;
  description: string | null;
}

export class CreateTransactionCategoryResponse {
  constructor(public readonly transactionCategory: TransactionCategoryEntity) {}

  fromResponse() {
    return this.transactionCategory.toObject();
  }
}

export default interface ICreateTransactionCategoryUseCase
  extends UseCase<
    CreateTransactionCategoryParam,
    CreateTransactionCategoryResponse
  > {}
