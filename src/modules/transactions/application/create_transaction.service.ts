import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import ServiceException from '@/core/exceptions/service.exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import { Amount } from '@/core/value-objects/amount';
import ITransactionRepository from '@/modules/transactions/adapters/i_transaction.repository';
import ITransactionCategoryRepository from '@/modules/transactions/adapters/i_transaction_category.repository';
import TransactionEntity from '@/modules/transactions/domain/entities/transaction.entity';
import ICreateTransactionUseCase, {
  CreateTransactionParam,
  CreateTransactionResponse,
} from '@/modules/transactions/domain/usecase/i_create_transaction_use_case';

export default class CreateTransactionService
  implements ICreateTransactionUseCase
{
  constructor(
    private readonly transactionRepository: ITransactionRepository,
    private readonly transactionCategoryRepository: ITransactionCategoryRepository,
  ) {}

  async execute(
    param: CreateTransactionParam,
  ): AsyncResult<AppException, CreateTransactionResponse> {
    try {
      const categoryResult =
        await this.transactionCategoryRepository.findOneById(param.categoryId);

      if (categoryResult.isLeft()) {
        return left(categoryResult.value);
      }

      const transaction = TransactionEntity.create({
        userId: param.userId,
        categoryId: param.categoryId,
        description: param.description,
        amount: Amount.fromReais(param.amount),
        type: param.type,
        createdAt: param.createdAt || undefined,
      });

      const saveResult = await this.transactionRepository.save(transaction);

      if (saveResult.isLeft()) {
        return left(saveResult.value);
      }

      const savedTransaction = saveResult.value;

      return right(new CreateTransactionResponse(savedTransaction));
    } catch (error) {
      return left(new ServiceException(ErrorMessages.UNEXPECTED_ERROR));
    }
  }
}
