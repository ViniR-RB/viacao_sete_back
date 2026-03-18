import { TransactionEntityProps } from '@/modules/transactions/domain/entities/transaction.entity';

type TransactionForReportReadModel = Pick<
  TransactionEntityProps,
  'id' | 'amount' | 'createdAt' | 'type' | "description"
> & {
  categoryName: string;
};

export default TransactionForReportReadModel;
