import UseCase from '@/core/interface/use_case';

export interface DeletePaymentMethodParam {
  id: string;
}

export class DeletePaymentMethodResponse {
  fromResponse() {
    return {
      message: 'Payment method deleted successfully',
    };
  }
}

export default interface IDeletePaymentMethodUseCase
  extends UseCase<DeletePaymentMethodParam, DeletePaymentMethodResponse> {}
