import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import ServiceException from '@/core/exceptions/service.exception';
import IUnitOfWork from '@/core/interface/i_unit_of_work';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import { Amount } from '@/core/value-objects/amount';
import IPaymentMethodRepository from '@/modules/transactions/adapters/i_payment_method.repository';
import ITransactionCategoryRepository from '@/modules/transactions/adapters/i_transaction_category.repository';
import TransactionEntity from '@/modules/transactions/domain/entities/transaction.entity';
import TransactionLineDetailsEntity from '@/modules/transactions/domain/entities/transaction_line_details.entity';
import ICreateTransactionUseCase, {
  CreateTransactionParam,
  CreateTransactionResponse,
} from '@/modules/transactions/domain/usecase/i_create_transaction_use_case';

export default class CreateTransactionService
  implements ICreateTransactionUseCase
{
  constructor(
    private readonly transactionCategoryRepository: ITransactionCategoryRepository,
    private readonly paymentMethodRepository: IPaymentMethodRepository,
    private readonly unitOfWork: IUnitOfWork,
  ) {}

  async execute(
    param: CreateTransactionParam,
  ): AsyncResult<AppException, CreateTransactionResponse> {
    try {
      this.unitOfWork.start();

      const results = await Promise.all([
        this.transactionCategoryRepository.findOneById(param.categoryId),
        this.paymentMethodRepository.findOneById(param.paymentMethodId),
      ]);

      for (const result of results) {
        if (result.isLeft()) {
          await this.unitOfWork.rollback();
          return left(result.value);
        }
      }

      const transactionId = crypto.randomUUID();

      let lineDetails: TransactionLineDetailsEntity | null = null;

      if (param.trasactionLineDetails !== null) {
        lineDetails = TransactionLineDetailsEntity.create({
          amountGo: Amount.fromCents(param.trasactionLineDetails.amountGo),
          amountReturn: Amount.fromCents(
            param.trasactionLineDetails.amountReturn,
          ),
          driveChange: Amount.fromCents(
            param.trasactionLineDetails.driveChange,
          ),
          transactionId: transactionId,
        });
      }

      const transaction = TransactionEntity.create({
        id: transactionId,
        userId: param.userId,
        categoryId: param.categoryId,
        description: param.description,
        transactionLineDetails: lineDetails,
        paymentMethodId: param.paymentMethodId,
        amountInCents: param.amount,
        type: param.type,
        createdAt: param.createdAt,
      });

      const transactionRepository = this.unitOfWork.getTransactionRepository();
      const saveResult = await transactionRepository.save(transaction);

      if (saveResult.isLeft()) {
        await this.unitOfWork.rollback();
        return left(saveResult.value);
      }

      const savedTransaction = saveResult.value;
      console.log(
        'Saved Transaction:',
        savedTransaction.transactionLineDetails,
      );
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
}
