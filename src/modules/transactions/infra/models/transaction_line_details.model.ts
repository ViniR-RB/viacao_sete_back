import { BaseModelPrimaryColumnUuid } from '@/core/interface/base_model';
import TransactionModel from '@/modules/transactions/infra/models/transaction.model';
import { Column, Entity, OneToOne } from 'typeorm';

@Entity('transaction_line_details')
export default class TransactionLineDetailsModel extends BaseModelPrimaryColumnUuid {
  @OneToOne(() => TransactionModel, transaction => transaction.id, {
    onDelete: 'CASCADE',
  })
  transaction: TransactionModel;

  @Column({
    type: 'uuid',
    name: 'transaction_id',
  })
  transactionId: string;

  @Column('bigint', {
    transformer: {
      to: (value: bigint) => value.toString(),
      from: (value: string) => BigInt(value),
    },
  })
  amountGo: bigint;
  @Column('bigint', {
    transformer: {
      to: (value: bigint) => value.toString(),
      from: (value: string) => BigInt(value),
    },
  })
  amountReturn: bigint;
  @Column('bigint', {
    transformer: {
      to: (value: bigint) => value.toString(),
      from: (value: string) => BigInt(value),
    },
  })
  driveChange: bigint;
}
