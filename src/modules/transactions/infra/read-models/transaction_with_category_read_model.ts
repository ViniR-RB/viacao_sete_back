import { TransactionCategoryEntityProps } from '@/modules/transactions/domain/entities/transaction-category.entity';
import { TransactionEntityProps } from '@/modules/transactions/domain/entities/transaction.entity';

export default interface TransactionWithCategoryReadModel
  extends Omit<TransactionEntityProps, 'categoryId'> {
  category: Pick<TransactionCategoryEntityProps, 'name' | 'description'>;
}
