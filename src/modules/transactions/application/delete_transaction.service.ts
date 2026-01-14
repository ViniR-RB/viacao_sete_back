import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import ServiceException from '@/core/exceptions/service.exception';
import IUnitOfWork from '@/core/interface/i_unit_of_work';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import IDeleteTransactionUseCase, {
  DeleteTransactionParam,
  DeleteTransactionResponse,
} from '@/modules/transactions/domain/usecase/i_delete_transaction_use_case';

export default class DeleteTransactionService
  implements IDeleteTransactionUseCase
{
  constructor(private readonly unitOfWork: IUnitOfWork) {}

  async execute(
    param: DeleteTransactionParam,
  ): AsyncResult<AppException, DeleteTransactionResponse> {
    try {
      await this.unitOfWork.start();

      const transactionRepository = this.unitOfWork.getTransactionRepository();

      // Verificar se a transação existe e pertence ao usuário
      const transactionFindResult = await transactionRepository.findOne({
        transactionId: param.id,
      });

      if (transactionFindResult.isLeft()) {
        await this.unitOfWork.rollback();
        return left(transactionFindResult.value);
      }

      const transaction = transactionFindResult.value;

      // Verificar se o usuário tem permissão para deletar a transação
      if (transaction.userId !== param.userId) {
        await this.unitOfWork.rollback();
        return left(new ServiceException(ErrorMessages.UNAUTHORIZED, 401));
      }

      // Deletar a transação (o cascade delete do banco vai deletar transaction_line_details automaticamente)
      const deleteResult = await transactionRepository.delete(transaction);

      if (deleteResult.isLeft()) {
        await this.unitOfWork.rollback();
        return left(deleteResult.value);
      }

      await this.unitOfWork.commit();

      return right(new DeleteTransactionResponse(true));
    } catch (error) {
      await this.unitOfWork.rollback();
      return left(
        new ServiceException(ErrorMessages.UNEXPECTED_ERROR, 500, error),
      );
    }
  }
}
