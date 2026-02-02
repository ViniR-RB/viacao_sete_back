import UseCase from '@/core/interface/use_case';

export interface CreatePaymentMethodParam {
  name: string;
  description?: string | null;
}

export interface CreatePaymentMethodResponse {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export default interface ICreatePaymentMethodUseCase
  extends UseCase<CreatePaymentMethodParam, CreatePaymentMethodResponse> {}
