import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import ServiceException from '@/core/exceptions/service.exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import IPaymentMethodRepository from '@/modules/transactions/adapters/i_payment_method.repository';
import IDeletePaymentMethodUseCase, {
  DeletePaymentMethodParam,
  DeletePaymentMethodResponse,
} from '@/modules/transactions/domain/usecase/i_delete_payment_method_use_case';

export default class DeletePaymentMethodService
  implements IDeletePaymentMethodUseCase
{
  constructor(
    private readonly paymentMethodRepository: IPaymentMethodRepository,
  ) {}

  async execute(
    param: DeletePaymentMethodParam,
  ): AsyncResult<AppException, DeletePaymentMethodResponse> {
    try {
      const result = await this.paymentMethodRepository.delete(param.id);

      if (result.isLeft()) {
        return left(result.value);
      }

      return right(new DeletePaymentMethodResponse());
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
