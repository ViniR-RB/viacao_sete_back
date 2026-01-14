import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import ServiceException from '@/core/exceptions/service.exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import ITransactionCategoryRepository from '@/modules/transactions/adapters/i_transaction_category.repository';
import IDeleteTransactionCategoryUseCase, {
  DeleteTransactionCategoryParam,
  DeleteTransactionCategoryResponse,
} from '@/modules/transactions/domain/usecase/i_delete_transaction_category_use_case';

export default class DeleteTransactionCategoryService
  implements IDeleteTransactionCategoryUseCase
{
  constructor(
    private readonly transactionCategoryRepository: ITransactionCategoryRepository,
  ) {}

  async execute(
    param: DeleteTransactionCategoryParam,
  ): AsyncResult<AppException, DeleteTransactionCategoryResponse> {
    try {
      // Buscar categoria existente para validar se existe
      const categoryResult =
        await this.transactionCategoryRepository.findOneById(param.id);

      if (categoryResult.isLeft()) {
        return left(categoryResult.value);
      }

      // Deletar a categoria
      const deleteResult = await this.transactionCategoryRepository.delete(
        param.id,
      );

      if (deleteResult.isLeft()) {
        return left(deleteResult.value);
      }

      return right(new DeleteTransactionCategoryResponse(true));
    } catch (error) {
      return left(
        new ServiceException(ErrorMessages.UNEXPECTED_ERROR, 500, error),
      );
    }
  }
}
