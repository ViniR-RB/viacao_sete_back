import { Amount } from '@/core/value-objects/amount';
import TransactionDomainException from '@/modules/transactions/exceptions/transaction_domain.exception';

export interface TransactionLineDetailsEntityProps {
  id: string;
  transactionId: string;
  amountGo: Amount;
  amountReturn: Amount;
  driveChange: Amount;
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
    };
  }

  static create(
    props: Omit<
      TransactionLineDetailsEntityProps,
      'id' | 'createdAt' | 'updatedAt'
    > & { id?: string; createdAt?: Date },
  ) {
    this.validate(props);

    return new TransactionLineDetailsEntity({
      ...props,
      id: props.id || crypto.randomUUID(),
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

  /**
   * Calcula o montante total da linha de detalhes
   * Soma: amountGo + amountReturn + driveChange
   */
  getTotalAmount(): Amount {
    return this.amountGo.add(this.amountReturn).add(this.driveChange);
  }

  private static validate(
    props: Omit<
      TransactionLineDetailsEntityProps,
      'id' | 'createdAt' | 'updatedAt'
    >,
  ) {
    if (props.amountGo.inCents < 0) {
      throw new TransactionDomainException('Amount go cannot be negative');
    }
    if (props.amountReturn.inCents < 0) {
      throw new TransactionDomainException('Amount return cannot be negative');
    }
    if (props.driveChange.inCents < 0) {
      throw new TransactionDomainException('Drive change cannot be negative');
    }
  }

  toObject() {
    return {
      id: this.props.id,
      transactionId: this.props.transactionId,
      amountGo: this.props.amountGo.getValue,
      amountReturn: this.props.amountReturn.getValue,
      driveChange: this.props.driveChange.getValue,
    };
  }
}
