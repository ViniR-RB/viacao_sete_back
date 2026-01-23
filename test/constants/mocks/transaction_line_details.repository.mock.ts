import ITransactionLineDetailsRepository from '@/modules/transactions/adapters/i_transaction_line_details.repository';

export class TransactionLineDetailsRepositoryMock
  implements ITransactionLineDetailsRepository
{
  findOne = jest.fn();
  create = jest.fn();
  save = jest.fn();
}
