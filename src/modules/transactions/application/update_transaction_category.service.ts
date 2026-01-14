import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import ServiceException from '@/core/exceptions/service.exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import ITransactionCategoryRepository from '@/modules/transactions/adapters/i_transaction_category.repository';
import TransactionCategoryEntity from '@/modules/transactions/domain/entities/transaction-category.entity';
import IUpdateTransactionCategoryUseCase, {
  UpdateTransactionCategoryParam,
  UpdateTransactionCategoryResponse,
} from '@/modules/transactions/domain/usecase/i_update_transaction_category_use_case';

export default class UpdateTransactionCategoryService
  implements IUpdateTransactionCategoryUseCase
{
  constructor(
    private readonly transactionCategoryRepository: ITransactionCategoryRepository,
  ) {}

  async execute(
    param: UpdateTransactionCategoryParam,
  ): AsyncResult<AppException, UpdateTransactionCategoryResponse> {
    try {
      const categoryResult =
        await this.transactionCategoryRepository.findOneById(param.id);

      if (categoryResult.isLeft()) {
        return left(categoryResult.value);
      }

      const existingCategory = categoryResult.value;

      // Verificar se o nome já existe (caso esteja mudando)
      if (param.name !== existingCategory.name) {
        const nameCheckResult =
          await this.transactionCategoryRepository.findByName(param.name);

        if (nameCheckResult.isRight()) {
          return left(
            new ServiceException('Category with this name already exists', 409),
          );
        }
        if (
          nameCheckResult.isLeft() &&
          nameCheckResult.value.statusCode !== 404
        ) {
          return left(nameCheckResult.value);
        }
      }

      // Criar entidade atualizada
      const updatedCategory = TransactionCategoryEntity.fromData({
        ...existingCategory.toObject(),
        id: existingCategory.id,
        userId: param.userId,
        name: param.name,
        description: param.description,
        createdAt: existingCategory.createdAt,
      });

      // Salvar no repository
      const saveResult =
        await this.transactionCategoryRepository.save(updatedCategory);

      if (saveResult.isLeft()) {
        return left(saveResult.value);
      }

      return right(new UpdateTransactionCategoryResponse(saveResult.value));
    } catch (error) {
      return left(
        new ServiceException(ErrorMessages.UNEXPECTED_ERROR, 500, error),
      );
    }
  }
}
