import { TransactionEntityProps } from '@/modules/transactions/domain/entities/transaction.entity';

export default interface TransactionWithTypeCreatedAndAmount
  extends Pick<TransactionEntityProps, 'type' | 'createdAt' | 'amount'> {}
