import { TransactionCategoryEntityProps } from '@/modules/transactions/domain/entities/transaction-category.entity';
import { TransactionEntityProps } from '@/modules/transactions/domain/entities/transaction.entity';
import { TransactionLineDetailsEntityProps } from '@/modules/transactions/domain/entities/transaction_line_details.entity';

export default interface TransactionWithCategoryReadModel
  extends Omit<TransactionEntityProps, 'categoryId'> {
  category: Pick<TransactionCategoryEntityProps, 'name' | 'description'>;
  lineDetails: Pick<
    TransactionLineDetailsEntityProps,
    'amountGo' | 'amountReturn' | 'driveChange'
  > | null;
}
