import { TransactionCategoryEntityProps } from '@/modules/transactions/domain/entities/transaction-category.entity';
import { TransactionEntityProps } from '@/modules/transactions/domain/entities/transaction.entity';
import { TransactionLineDetailsEntityProps } from '@/modules/transactions/domain/entities/transaction_line_details.entity';

export default interface TransactionWithCategoryReadModel
  extends Omit<
    TransactionEntityProps,
    'categoryId' | 'transactionLineDetails'
  > {
  category: Pick<TransactionCategoryEntityProps, 'id' | 'name' | 'description'>;
  lineDetails: Pick<
    TransactionLineDetailsEntityProps,
    'amountGo' | 'amountReturn' | 'driveChange'
  > | null;
}
