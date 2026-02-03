import { TransactionType } from '@/modules/transactions/domain/types/transaction-type';
import PaymentMethodModel from '@/modules/transactions/infra/models/payment-method.model';
import TransactionLineDetailsModel from '@/modules/transactions/infra/models/transaction_line_details.model';
import UserModel from '@/modules/users/infra/models/user.model';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import TransactionCategoryModel from './transaction-category.model';

@Entity('transactions')
export default class TransactionModel {
  @PrimaryColumn('uuid')
  id: string;

  @ManyToOne(() => UserModel, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user: UserModel;

  @Column({ nullable: true })
  userId: number | null;

  @Column('uuid')
  categoryId: string;

  @ManyToOne(() => TransactionCategoryModel)
  @JoinColumn({ name: 'categoryId' })
  category: TransactionCategoryModel;

  @Column({ type: 'uuid', nullable: true, name: 'paymentMethodId' })
  paymentMethodId: string | null;

  @ManyToOne(() => PaymentMethodModel, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'paymentMethodId' })
  paymentMethod: PaymentMethodModel | null;

  @OneToOne(
    () => TransactionLineDetailsModel,
    transactionLineDetailsModel => transactionLineDetailsModel.transaction,
    { nullable: true, cascade: true },
  )
  transactionLineDetails: TransactionLineDetailsModel | null;

  @Column('varchar', { length: 255 })
  description: string;

  @Column('numeric', {
    precision: 10,
    scale: 2,
  })
  amount: number;

  @Column('enum', { enum: TransactionType })
  type: TransactionType;

  @Column('simple-array', {
    name: 'attachments_ids',
  })
  attachmentsIds: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
