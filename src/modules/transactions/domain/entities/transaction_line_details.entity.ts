import { Amount } from '@/core/value-objects/amount';

export interface TransactionLineDetailsEntityProps {
  id: string;
  transactionId: string;
  amountGo: Amount;
  amountReturn: Amount;
  driveChange: Amount;
  createdAt: Date;
  updatedAt: Date;
}
export default class TransactionLineDetailsEntity {
  private constructor(
    private readonly props: TransactionLineDetailsEntityProps,
  ) {
    this.props = {
      id: props.id,
      transactionId: props.transactionId,
      amountGo: props.amountGo,
      amountReturn: props.amountReturn,
      driveChange: props.driveChange,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    };
  }

  static create(
    props: Omit<
      TransactionLineDetailsEntityProps,
      'id' | 'createdAt' | 'updatedAt'
    > & { id?: string; createdAt?: Date },
  ) {
    return new TransactionLineDetailsEntity({
      ...props,
      id: props.id || crypto.randomUUID(),
      createdAt: props.createdAt || new Date(),
      updatedAt: new Date(),
    });
  }

  static fromData(props: TransactionLineDetailsEntityProps) {
    return new TransactionLineDetailsEntity(props);
  }

  get id() {
    return this.props.id;
  }

  get transactionId() {
    return this.props.transactionId;
  }

  get amountGo() {
    return this.props.amountGo;
  }

  get amountReturn() {
    return this.props.amountReturn;
  }

  get driveChange() {
    return this.props.driveChange;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  toObject() {
    return {
      id: this.id,
      transactionId: this.transactionId,
      amountGo: this.amountGo,
      amountReturn: this.amountReturn,
      driveChange: this.driveChange,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
