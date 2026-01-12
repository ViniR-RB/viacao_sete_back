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

  @Column('bigint', {
    transformer: {
      to: (value: bigint | null) => value?.toString(),
      from: (value: string | null) => (value ? BigInt(value) : null),
    },
  })
  amountGo: bigint;
  @Column('bigint', {
    transformer: {
      to: (value: bigint | null) => value?.toString(),
      from: (value: string | null) => (value ? BigInt(value) : null),
    },
  })
  amountReturn: bigint;
  @Column('bigint', {
    transformer: {
      to: (value: bigint | null) => value?.toString(),
      from: (value: string | null) => (value ? BigInt(value) : null),
    },
  })
  driveChange: bigint;
}
