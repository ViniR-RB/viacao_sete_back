import { SplitPaymentEntityProps } from '@/modules/transactions/domain/entities/split_payment.entity';
import { TransactionCategoryEntityProps } from '@/modules/transactions/domain/entities/transaction-category.entity';
import { TransactionEntityProps } from '@/modules/transactions/domain/entities/transaction.entity';
import { TransactionLineDetailsEntityProps } from '@/modules/transactions/domain/entities/transaction_line_details.entity';

export default interface TransactionWithCategoryReadModel
  extends Omit<
    TransactionEntityProps,
    'categoryId' | 'transactionLineDetails' | 'splitPayments'
  > {
  category: Pick<TransactionCategoryEntityProps, 'id' | 'name' | 'description'>;
  splitPayments: Omit<SplitPaymentEntityProps, ''>[];
  lineDetails: Pick<
    TransactionLineDetailsEntityProps,
    'amountGo' | 'amountReturn' | 'driveChange' | 'id'
  > | null;
}
