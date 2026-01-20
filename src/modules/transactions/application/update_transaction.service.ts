import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import ServiceException from '@/core/exceptions/service.exception';
import IUnitOfWork from '@/core/interface/i_unit_of_work';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import { Amount } from '@/core/value-objects/amount';
import ITransactionCategoryRepository from '@/modules/transactions/adapters/i_transaction_category.repository';
import TransactionEntity from '@/modules/transactions/domain/entities/transaction.entity';
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
  ) {}
  async execute(
    param: UpdateTransactionParam,
  ): AsyncResult<AppException, UpdateTransactionResponse> {
    try {
      await this.unitOfWork.start();

      const categoryFinderResult =
        await this.transactionCategoryRepository.findOneById(param.categoryId);

      if (categoryFinderResult.isLeft()) {
        await this.unitOfWork.rollback();
        return left(categoryFinderResult.value);
      }

      const transactionRepository = this.unitOfWork.getTransactionRepository();

      const transactionFindResult = await transactionRepository.findOne({
        transactionId: param.id,
      });

      if (transactionFindResult.isLeft()) {
        await this.unitOfWork.rollback();
        return left(transactionFindResult.value);
      }
      let currentAmount = Amount.fromCents(param.amount || 0);
      let updateTransactionLineUpdate: TransactionLineDetailsEntity | null =
        null;
      if (
        param.trasactionLineDetails &&
        transactionFindResult.value.transactionLineDetailsId
      ) {
        const transactionLineDetailsRepository =
          this.unitOfWork.getTransactionLineDetailsRepository();

        const transactionLineDetailsFindeResult =
          await transactionLineDetailsRepository.findOne({
            transactionLineDetailsId:
              transactionFindResult.value.transactionLineDetailsId,
          });

        if (transactionLineDetailsFindeResult.isLeft()) {
          await this.unitOfWork.rollback();
          return left(transactionLineDetailsFindeResult.value);
        }
        const amountGo = Amount.fromCents(param.trasactionLineDetails.amountGo);
        const amountReturn = Amount.fromCents(
          param.trasactionLineDetails.amountReturn,
        );
        const driveChange = Amount.fromCents(
          param.trasactionLineDetails.driveChange,
        );
        currentAmount = amountGo
          .add(amountReturn)
          .add(driveChange)
          .add(amountGo);

        const savedTransactionLineDetails =
          await transactionLineDetailsRepository.save(
            TransactionLineDetailsEntity.create({
              ...transactionLineDetailsFindeResult.value.toObject(),
              amountGo: amountGo,
              amountReturn: amountReturn,
              driveChange: driveChange,
            }),
          );
        if (savedTransactionLineDetails.isLeft()) {
          await this.unitOfWork.rollback();
          return left(savedTransactionLineDetails.value);
        }
        updateTransactionLineUpdate = savedTransactionLineDetails.value;
      }

      const savedTransactionResult = await transactionRepository.save(
        TransactionEntity.create({
          ...transactionFindResult.value.toObject(),
          categoryId: param.categoryId,
          description: param.description,
          amount: currentAmount,
          type: param.type,
          createdAt: param.createdAt,
        }),
      );

      if (savedTransactionResult.isLeft()) {
        return left(savedTransactionResult.value);
      }
      await this.unitOfWork.commit();
      return right(
        new UpdateTransactionResponse(
          savedTransactionResult.value,
          updateTransactionLineUpdate,
        ),
      );
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
