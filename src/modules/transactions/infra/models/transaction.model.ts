import { TransactionType } from '@/modules/transactions/domain/types/transaction-type';
import SplitPaymentModel from '@/modules/transactions/infra/models/split_payment.model';
import TransactionLineDetailsModel from '@/modules/transactions/infra/models/transaction_line_details.model';
import UserModel from '@/modules/users/infra/models/user.model';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
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

  @OneToMany(
    () => SplitPaymentModel,
    splitPayment => splitPayment.transaction,
    {
      cascade: ['insert', 'update'],
      eager: true,
      orphanedRowAction: 'delete',
    },
  )
  splitPayments: SplitPaymentModel[];

  @OneToOne(
    () => TransactionLineDetailsModel,
    transactionLineDetailsModel => transactionLineDetailsModel.transaction,
    {
      nullable: true,
      cascade: ['insert', 'update', 'remove'],
      eager: true,
      onDelete: 'CASCADE',
    },
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
