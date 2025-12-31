import { TransactionType } from '@/modules/transactions/domain/types/transaction-type';
import UserModel from '@/modules/users/infra/models/user.model';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
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

  @Column('varchar', { length: 255 })
  description: string;

  @Column('bigint')
  amount: number;

  @Column('enum', { enum: TransactionType })
  type: TransactionType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
