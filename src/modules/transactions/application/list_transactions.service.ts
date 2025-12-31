import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import ServiceException from '@/core/exceptions/service.exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import ITransactionRepository from '@/modules/transactions/adapters/i_transaction.repository';
import IListTransactionsUseCase, {
  ListTransactionsParam,
  ListTransactionsResponse,
} from '@/modules/transactions/domain/usecase/i_list_transactions_use_case';

export default class ListTransactionsService
  implements IListTransactionsUseCase
{
  constructor(private readonly transactionRepository: ITransactionRepository) {}

  async execute(
    param: ListTransactionsParam,
  ): AsyncResult<AppException, ListTransactionsResponse> {
    try {
      const result = await this.transactionRepository.findByFiltersPagination({
        userId: param.userId,
        options: param.options,
        categoryId: param.categoryId,
        type: param.type,
        startDate: param.startDate,
        endDate: param.endDate,
      });

      if (result.isLeft()) {
        return left(result.value);
      }

      const transactionPage = result.value;

      return right(new ListTransactionsResponse(transactionPage));
    } catch (error) {
      return left(
        new ServiceException(ErrorMessages.UNEXPECTED_ERROR, 500, error),
      );
    }
  }
}
