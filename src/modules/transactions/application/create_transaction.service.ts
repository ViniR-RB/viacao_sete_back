import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import ServiceException from '@/core/exceptions/service.exception';
import IUnitOfWork from '@/core/interface/i_unit_of_work';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import { Amount } from '@/core/value-objects/amount';
import ITransactionCategoryRepository from '@/modules/transactions/adapters/i_transaction_category.repository';
import TransactionEntity from '@/modules/transactions/domain/entities/transaction.entity';
import TransactionCreationDomainService from '@/modules/transactions/domain/services/transaction_creation.domain_service';
import ICreateTransactionUseCase, {
  CreateTransactionParam,
  CreateTransactionResponse,
} from '@/modules/transactions/domain/usecase/i_create_transaction_use_case';
import { randomUUID } from 'crypto';

export default class CreateTransactionService
  implements ICreateTransactionUseCase
{
  constructor(
    private readonly transactionCategoryRepository: ITransactionCategoryRepository,
    private readonly transactionCreationDomainService: TransactionCreationDomainService,
    private readonly unitOfWork: IUnitOfWork,
  ) {}

  async execute(
    param: CreateTransactionParam,
  ): AsyncResult<AppException, CreateTransactionResponse> {
    try {
      this.unitOfWork.start();

      // 1. Validar categoria
      const categoryResult = await this.validateCategory(param.categoryId);
      if (categoryResult.isLeft()) {
        await this.unitOfWork.rollback();
        return left(categoryResult.value);
      }

      const transactionId = randomUUID();

      // 2. Processar linha de detalhes através do Domain Service
      const processLineDetailsResult =
        await this.transactionCreationDomainService.processLineDetails(
          param.trasactionLineDetails,
          transactionId,
        );

      if (processLineDetailsResult.isLeft()) {
        await this.unitOfWork.rollback();
        return left(processLineDetailsResult.value);
      }

      const { amount: finalAmount, lineDetailsId } =
        processLineDetailsResult.value;

      // 3. Se não houver detalhes, usar o montante simples
      const transactionAmount =
        param.trasactionLineDetails === null && param.amount
          ? Amount.fromReais(param.amount)
          : finalAmount;

      // 4. Criar entidade de transação (que valida automaticamente via TransactionEntity.create)
      const transaction: TransactionEntity = TransactionEntity.create({
        id: transactionId,
        userId: param.userId,
        categoryId: param.categoryId,
        description: param.description,
        transactionLineDetailsId: lineDetailsId,
        amount: transactionAmount,
        type: param.type,
        createdAt: param.createdAt,
      });

      // 5. Persistir transação
      const transactionRepository = this.unitOfWork.getTransactionRepository();
      const saveResult = await transactionRepository.save(transaction);
      if (saveResult.isLeft()) {
        await this.unitOfWork.rollback();
        return left(saveResult.value);
      }

      // 6. Confirmar transação
      const savedTransaction = saveResult.value;
      await this.unitOfWork.commit();
      return right(new CreateTransactionResponse(savedTransaction));
    } catch (error) {
      await this.unitOfWork.rollback();
      if (error instanceof AppException) {
        return left(error);
      }
      return left(
        new ServiceException(ErrorMessages.UNEXPECTED_ERROR, 500, error),
      );
    }
  }

  /**
   * Valida se a categoria existe no banco de dados
   */
  private async validateCategory(categoryId: string) {
    return await this.transactionCategoryRepository.findOneById(categoryId);
  }
}
