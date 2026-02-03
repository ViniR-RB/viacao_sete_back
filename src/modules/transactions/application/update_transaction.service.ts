import AppException from '@/core/exceptions/app_exception';
import IUnitOfWork from '@/core/interface/i_unit_of_work';
import AsyncResult from '@/core/types/async_result';
import ITransactionCategoryRepository from '@/modules/transactions/adapters/i_transaction_category.repository';
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
    throw new Error('Method not implemented.');
  }
}
