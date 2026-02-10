import IAttachmentRepository from '@/modules/attachments/adapters/i_attachment.repository';
import ITransactionRepository from '@/modules/transactions/adapters/i_transaction.repository';

export default interface IUnitOfWork {
  start(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  getTransactionRepository(): ITransactionRepository;
  getAttachmentRepository(): IAttachmentRepository;
}
