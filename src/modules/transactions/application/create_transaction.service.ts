import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import ServiceException from '@/core/exceptions/service.exception';
import IUnitOfWork from '@/core/interface/i_unit_of_work';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import { Amount } from '@/core/value-objects/amount';
import ITransactionCategoryRepository from '@/modules/transactions/adapters/i_transaction_category.repository';
import ITransactionLineDetailsRepository from '@/modules/transactions/adapters/i_transaction_line_details.repository';
import TransactionEntity from '@/modules/transactions/domain/entities/transaction.entity';
import TransactionLineDetailsEntity from '@/modules/transactions/domain/entities/transaction_line_details.entity';
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
      const transactionRepository = this.unitOfWork.getTransactionRepository();
      const transactionLineDetailsRepository =
        this.unitOfWork.getTransactionLineDetailsRepository();

      // 2. Processar linha de detalhes (se existir)
      const processTransactionLineDetailsResult =
        await this.processTransactionLineDetails(
          param,
          transactionId,
          transactionLineDetailsRepository,
        );

      if (processTransactionLineDetailsResult.isLeft()) {
        return left(processTransactionLineDetailsResult.value);
      }

      // 3. Se não houver detalhes, calcular montante simples
      const finalAmount =
        param.trasactionLineDetails === null && param.amount
          ? Amount.fromReais(param.amount)
          : processTransactionLineDetailsResult.value.amount;

      // 4. Validar montante
      this.validateAmount(finalAmount);

      // 5. Criar e persistir transação
      const transaction = TransactionEntity.create({
        id: transactionId,
        userId: param.userId,
        categoryId: param.categoryId,
        description: param.description,
        transactionLineDetailsId:
          processTransactionLineDetailsResult.value.transactionLineDetailsId,
        amount: finalAmount,
        type: param.type,
        createdAt: param.createdAt,
      });

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
      return left(new ServiceException(ErrorMessages.UNEXPECTED_ERROR));
    }
  }

  /**
   * Valida se a categoria existe no banco de dados
   */
  private async validateCategory(categoryId: string) {
    return await this.transactionCategoryRepository.findOneById(categoryId);
  }

  /**
   * Processa a linha de detalhes da transação (ida, volta, troco)
   * Retorna o montante total calculado e o ID da linha de detalhes
   */
  private async processTransactionLineDetails(
    param: CreateTransactionParam,
    transactionId: string,
    transactionLineDetailsRepository: ITransactionLineDetailsRepository,
  ): AsyncResult<
    AppException,
    { amount: Amount; transactionLineDetailsId: string | null }
  > {
    if (!param.trasactionLineDetails) {
      return right({
        amount: Amount.fromCents(0),
        transactionLineDetailsId: null,
      });
    }

    const transactionLineDetailsId = randomUUID();

    const { amountGo, amountReturn, driveChange } = param.trasactionLineDetails;

    const amountGoValue = Amount.fromReais(amountGo);
    const amountReturnValue = Amount.fromReais(amountReturn);
    const driveChangeValue = Amount.fromReais(driveChange);

    const totalAmount = amountGoValue
      .add(amountReturnValue)
      .add(driveChangeValue);

    const transactionLineDetails = TransactionLineDetailsEntity.create({
      id: transactionLineDetailsId,
      transactionId,
      amountGo: amountGoValue,
      amountReturn: amountReturnValue,
      driveChange: driveChangeValue,
    });

    const saveLineDetailsResult = await transactionLineDetailsRepository.save(
      transactionLineDetails,
    );

    if (saveLineDetailsResult.isLeft()) {
      return left(saveLineDetailsResult.value);
    }

    return right({ amount: totalAmount, transactionLineDetailsId });
  }

  /**
   * Valida se o montante é válido (maior que zero)
   */
  private validateAmount(amount: Amount) {
    if (amount.inCents <= BigInt(0)) {
      throw new ServiceException(ErrorMessages.TRANSACTION_INVALID_AMOUNT, 400);
    }
  }
}
