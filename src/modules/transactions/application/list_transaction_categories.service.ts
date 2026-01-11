import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import ServiceException from '@/core/exceptions/service.exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import ITransactionCategoryRepository from '@/modules/transactions/adapters/i_transaction_category.repository';
import IListTransactionCategoriesUseCase, {
  ListTransactionCategoriesParam,
  ListTransactionCategoriesResponse,
} from '@/modules/transactions/domain/usecase/i_list_transaction_categories_use_case';

export default class ListTransactionCategoriesService
  implements IListTransactionCategoriesUseCase
{
  constructor(
    private readonly transactionCategoryRepository: ITransactionCategoryRepository,
  ) {}

  async execute(
    param: ListTransactionCategoriesParam,
  ): AsyncResult<AppException, ListTransactionCategoriesResponse> {
    try {
      const result =
        await this.transactionCategoryRepository.findByFiltersPagination(
          param.options,
          param.name,
          param.type,
        );

      if (result.isLeft()) {
        return left(result.value);
      }

      const categoryPage = result.value;

      return right(new ListTransactionCategoriesResponse(categoryPage));
    } catch (error) {
      return left(
        new ServiceException(ErrorMessages.UNEXPECTED_ERROR, 500, error),
      );
    }
  }
}
