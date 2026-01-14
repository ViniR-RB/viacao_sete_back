import UseCase from '@/core/interface/use_case';

export interface DeleteTransactionParam {
  id: string;
  userId: number;
}

export class DeleteTransactionResponse {
  constructor(public readonly success: boolean) {}

  fromResponse() {
    return {
      success: this.success,
      message: 'Transaction deleted successfully',
    };
  }
}

export default interface IDeleteTransactionUseCase
  extends UseCase<DeleteTransactionParam, DeleteTransactionResponse> {}
