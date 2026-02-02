import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import ServiceException from '@/core/exceptions/service.exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import IPaymentMethodRepository from '@/modules/transactions/adapters/i_payment_method.repository';
import PaymentMethodEntity from '@/modules/transactions/domain/entities/payment-method.entity';
import ICreatePaymentMethodUseCase from '@/modules/transactions/domain/usecase/i_create_payment_method_use_case';

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

export default class CreatePaymentMethodService
  implements ICreatePaymentMethodUseCase
{
  constructor(
    private readonly paymentMethodRepository: IPaymentMethodRepository,
  ) {}

  async execute(
    params: CreatePaymentMethodParam,
  ): AsyncResult<AppException, CreatePaymentMethodResponse> {
    try {
      const entity = PaymentMethodEntity.create({
        name: params.name,
        description: params.description || null,
      });

      const result = await this.paymentMethodRepository.save(entity);

      if (result.isLeft()) {
        return result;
      }

      return right({
        id: result.value.id,
        name: result.value.name,
        description: result.value.description,
        createdAt: result.value.createdAt,
        updatedAt: result.value.updatedAt,
      });
    } catch (error) {
      if (error instanceof AppException) {
        return left(error);
      }
      return left(
        new ServiceException(ErrorMessages.UNEXPECTED_ERROR, 500, error),
      );
    }
  }
}
