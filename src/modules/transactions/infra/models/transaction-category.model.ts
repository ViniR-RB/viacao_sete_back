import TransactionCategoryType from '@/modules/transactions/domain/entities/transaction_category_enum';
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

@Entity('transaction_categories')
export default class TransactionCategoryModel {
  @PrimaryColumn('uuid')
  id: string;

  @ManyToOne(() => UserModel, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user: UserModel;

  @Column({ nullable: true })
  userId: number | null;

  @Column('varchar', { length: 100 })
  name: string;

  @Column('varchar', { length: 255, nullable: true })
  description: string | null;

  @Column({
    type: 'simple-array',
    name: 'types',
  })
  types: TransactionCategoryType[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
