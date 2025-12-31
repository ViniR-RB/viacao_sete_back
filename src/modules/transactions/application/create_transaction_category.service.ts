import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import ServiceException from '@/core/exceptions/service.exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import ITransactionCategoryRepository from '@/modules/transactions/adapters/i_transaction_category.repository';
import TransactionCategoryEntity from '@/modules/transactions/domain/entities/transaction-category.entity';
import ICreateTransactionCategoryUseCase, {
  CreateTransactionCategoryParam,
  CreateTransactionCategoryResponse,
} from '@/modules/transactions/domain/usecase/i_create_transaction_category_use_case';

export default class CreateTransactionCategoryService
  implements ICreateTransactionCategoryUseCase
{
  constructor(
    private readonly transactionCategoryRepository: ITransactionCategoryRepository,
  ) {}

  async execute(
    param: CreateTransactionCategoryParam,
  ): AsyncResult<AppException, CreateTransactionCategoryResponse> {
    try {
      const existingResult =
        await this.transactionCategoryRepository.findByName(param.name);

      if (existingResult.isRight()) {
        return left(
          new ServiceException('Category with this name already exists'),
        );
      }

      // Criar entidade
      const category = TransactionCategoryEntity.create({
        userId: param.userId,
        name: param.name,
        description: param.description,
      });

      // Salvar no repository
      const saveResult =
        await this.transactionCategoryRepository.save(category);

      if (saveResult.isLeft()) {
        return left(saveResult.value);
      }

      return right(new CreateTransactionCategoryResponse(saveResult.value));
    } catch (error) {
      return left(
        new ServiceException(ErrorMessages.UNEXPECTED_ERROR, 500, error),
      );
    }
  }
}
