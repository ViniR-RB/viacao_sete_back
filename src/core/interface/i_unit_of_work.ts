import ITransactionRepository from '@/modules/transactions/adapters/i_transaction.repository';
import ITransactionLineDetailsRepository from '@/modules/transactions/adapters/i_transaction_line_details.repository';

export default interface IUnitOfWork {
  start(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  getTransactionRepository(): ITransactionRepository;
  getTransactionLineDetailsRepository(): ITransactionLineDetailsRepository;
}
