import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import ServiceException from '@/core/exceptions/service.exception';
import IUnitOfWork from '@/core/interface/i_unit_of_work';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import { Amount } from '@/core/value-objects/amount';
import IPaymentMethodRepository from '@/modules/transactions/adapters/i_payment_method.repository';
import ITransactionCategoryRepository from '@/modules/transactions/adapters/i_transaction_category.repository';
import TransactionLineDetailsEntity from '@/modules/transactions/domain/entities/transaction_line_details.entity';
import IUpdateTransactionUseCase, {
  UpdateTransactionParam,
  UpdateTransactionResponse,
} from '@/modules/transactions/domain/usecase/i_update_transaction_use_case';

export default class UpdateTransactionService
  implements IUpdateTransactionUseCase
{
  constructor(
    private readonly unitOfWork: IUnitOfWork,
    private readonly transactionCategoryRepository: ITransactionCategoryRepository,
    private readonly paymentMethodRepository: IPaymentMethodRepository,
  ) {}
  async execute(
    param: UpdateTransactionParam,
  ): AsyncResult<AppException, UpdateTransactionResponse> {
    try {
      this.unitOfWork.start();

      const transactionRepository = this.unitOfWork.getTransactionRepository();

      const transactionFindResult = await transactionRepository.findOne({
        transactionId: param.id,
      });

      if (transactionFindResult.isLeft()) {
        await this.unitOfWork.rollback();
        return left(transactionFindResult.value);
      }

      const transaction = transactionFindResult.value;

      if (param.categoryId && param.categoryId !== transaction.categoryId) {
        const categoryResult =
          await this.transactionCategoryRepository.findOneById(
            param.categoryId,
          );

        if (categoryResult.isLeft()) {
          await this.unitOfWork.rollback();
          return left(categoryResult.value);
        }
      }

      if (
        param.paymentMethodId !== undefined &&
        param.paymentMethodId !== transaction.paymentMethodId
      ) {
        if (param.paymentMethodId !== null) {
          const paymentMethodResult =
            await this.paymentMethodRepository.findOneById(
              param.paymentMethodId,
            );
          if (paymentMethodResult.isLeft()) {
            await this.unitOfWork.rollback();
            return left(paymentMethodResult.value);
          }
        }
      }

      let lineDetails: TransactionLineDetailsEntity | null = null;

      if (
        param.transactionLineDetails &&
        param.transactionLineDetails !== null
      ) {
        const transactionLineDetailsId =
          transaction.transactionLineDetails?.id || crypto.randomUUID();

        lineDetails = TransactionLineDetailsEntity.create({
          id: transactionLineDetailsId,
          transactionId: transaction.id,
          amountGo: Amount.fromCents(param.transactionLineDetails.amountGo),
          amountReturn: Amount.fromCents(
            param.transactionLineDetails.amountReturn,
          ),
          driveChange: Amount.fromCents(
            param.transactionLineDetails.driveChange,
          ),
        });
      }

      transaction.update({
        description: param.description,
        type: param.type,
        amountInCents: param.amount,
        paymentMethodId: param.paymentMethodId,
        categoryId: param.categoryId,
        transactionLineDetails: lineDetails,
        createdAt: param.createdAt,
      });
      const saveResult = await transactionRepository.save(transaction);

      if (saveResult.isLeft()) {
        await this.unitOfWork.rollback();
        return left(saveResult.value);
      }

      const updatedTransaction = saveResult.value;
      await this.unitOfWork.commit();

      return right(new UpdateTransactionResponse(updatedTransaction));
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
