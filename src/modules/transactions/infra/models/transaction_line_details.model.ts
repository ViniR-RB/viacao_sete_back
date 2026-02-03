import TransactionModel from '@/modules/transactions/infra/models/transaction.model';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

@Entity('transaction_line_details')
export default class TransactionLineDetailsModel {
  @PrimaryColumn('uuid')
  id: string;

  @OneToOne(
    () => TransactionModel,
    transaction => transaction.transactionLineDetails,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'transaction_id' })
  transaction?: TransactionModel;

  @Column({
    type: 'uuid',
    name: 'transaction_id',
  })
  transactionId: string;

  @Column('numeric', {
    precision: 10,
    scale: 2,
    nullable: true,
  })
  amountGo: number | null;

  @Column('numeric', {
    precision: 10,
    scale: 2,
    nullable: true,
  })
  amountReturn: number | null;

  @Column('numeric', {
    precision: 10,
    scale: 2,
    nullable: true,
  })
  driveChange: number | null;
}
