import UseCase from '@/core/interface/use_case';

export interface DeleteTransactionCategoryParam {
  id: string;
  userId: number;
}

export class DeleteTransactionCategoryResponse {
  constructor(public readonly success: boolean) {}

  fromResponse() {
    return { success: this.success };
  }
}

export default interface IDeleteTransactionCategoryUseCase
  extends UseCase<
    DeleteTransactionCategoryParam,
    DeleteTransactionCategoryResponse
  > {}
