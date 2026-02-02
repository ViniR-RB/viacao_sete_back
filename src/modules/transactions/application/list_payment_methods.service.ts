import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import ServiceException from '@/core/exceptions/service.exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import PageOptionsEntity from '@/modules/pagination/domain/entities/page_options.entity';
import IPaymentMethodRepository from '@/modules/transactions/adapters/i_payment_method.repository';
import IListPaymentMethodUseCase, {
  ListPaymentMethodsParam,
  ListPaymentMethodsResponse,
} from '@/modules/transactions/domain/usecase/i_list_payment_method_use_case';

export default class ListPaymentMethodsService
  implements IListPaymentMethodUseCase
{
  constructor(
    private readonly paymentMethodRepository: IPaymentMethodRepository,
  ) {}

  async execute(
    params: ListPaymentMethodsParam,
  ): AsyncResult<AppException, ListPaymentMethodsResponse> {
    try {
      const pageOptionsEntity = new PageOptionsEntity(
        params.options.order,
        params.options.page,
        params.options.take,
      );

      const result = await this.paymentMethodRepository.findMany(
        pageOptionsEntity,
        params.name,
      );

      if (result.isLeft()) {
        return left(result.value);
      }

      return right(new ListPaymentMethodsResponse(result.value));
    } catch (error) {
      return left(
        new ServiceException(ErrorMessages.UNEXPECTED_ERROR, 500, error),
      );
    }
  }
}
