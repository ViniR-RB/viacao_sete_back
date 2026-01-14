import { BaseModelPrimaryColumnUuid } from '@/core/interface/base_model';
import TransactionModel from '@/modules/transactions/infra/models/transaction.model';
import { Column, Entity, OneToOne } from 'typeorm';

@Entity('transaction_line_details')
export default class TransactionLineDetailsModel extends BaseModelPrimaryColumnUuid {
  @OneToOne(() => TransactionModel, transaction => transaction.id)
  transaction: TransactionModel;

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
