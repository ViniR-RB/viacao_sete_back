import PaymentMethodModel from '@/modules/transactions/infra/models/payment-method.model';
import TransactionModel from '@/modules/transactions/infra/models/transaction.model';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity({ name: 'split_payments' })
export default class SplitPaymentModel {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'paymentMethodId' })
  paymentMethodId: string;

  @ManyToOne(() => PaymentMethodModel, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'paymentMethodId' })
  paymentMethod: PaymentMethodModel;

  @Column({ type: 'uuid', name: 'transactionId' })
  transactionId: string;
  @ManyToOne(() => TransactionModel, transaction => transaction.splitPayments, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'transactionId' })
  transaction: TransactionModel;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  amount: number;
}
