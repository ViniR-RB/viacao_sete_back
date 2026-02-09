import { Amount } from '@/core/value-objects/amount';

export interface SplitPaymentEntityProps {
  id: string;
  paymentMethodId: string;
  transactionId: string;
  amount: Amount;
}

export default class SplitPaymentEntity {
  private constructor(private readonly props: SplitPaymentEntityProps) {
    this.props = {
      id: props.id,
      transactionId: props.transactionId,
      paymentMethodId: props.paymentMethodId,
      amount: props.amount,
    };
  }

  static create(
    props: Omit<SplitPaymentEntityProps, 'id' | 'amount'> & {
      id?: string;
      amount: number;
    },
  ) {
    return new SplitPaymentEntity({
      id: props.id ?? crypto.randomUUID(),
      amount: Amount.fromCents(props.amount),
      paymentMethodId: props.paymentMethodId,
      transactionId: props.transactionId,
    });
  }

  static fromData(props: SplitPaymentEntityProps) {
    return new SplitPaymentEntity({
      id: props.id,
      paymentMethodId: props.paymentMethodId,
      transactionId: props.transactionId,
      amount: props.amount,
    });
  }

  get id() {
    return this.props.id;
  }

  get paymentMethodId() {
    return this.props.paymentMethodId;
  }

  get transactionId() {
    return this.props.transactionId;
  }

  get amount() {
    return this.props.amount;
  }

  toObject() {
    return {
      id: this.props.id,
      paymentMethodId: this.props.paymentMethodId,
      transactionId: this.props.transactionId,
      amount: this.props.amount.getValue,
    };
  }
}
