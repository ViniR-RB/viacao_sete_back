import { Amount } from '@/core/value-objects/amount';
import TransactionDomainException from '@/modules/transactions/exceptions/transaction_domain.exception';

export interface TransactionLineDetailsInputProps {
  amountGo: number;
  amountReturn: number;
  driveChange: number;
}

/**
 * Value Object que encapsula os detalhes de uma linha de transação
 * Responsável por validar e calcular o montante total
 */
export class TransactionLineDetailsInput {
  private readonly amountGoValue: Amount;
  private readonly amountReturnValue: Amount;
  private readonly driveChangeValue: Amount;
  private readonly totalAmount: Amount;

  private constructor(props: TransactionLineDetailsInputProps) {
    this.amountGoValue = Amount.fromReais(props.amountGo);
    this.amountReturnValue = Amount.fromReais(props.amountReturn);
    this.driveChangeValue = Amount.fromReais(props.driveChange);

    this.validate();

    this.totalAmount = this.amountGoValue
      .add(this.amountReturnValue)
      .add(this.driveChangeValue);
  }

  static create(
    props: TransactionLineDetailsInputProps,
  ): TransactionLineDetailsInput {
    return new TransactionLineDetailsInput(props);
  }

  private validate(): void {
    if (
      this.amountGoValue.inCents < BigInt(0) ||
      this.amountReturnValue.inCents < BigInt(0) ||
      this.driveChangeValue.inCents < BigInt(0)
    ) {
      throw new TransactionDomainException(
        'Transaction line details amounts cannot be negative',
      );
    }
  }

  get amountGo(): Amount {
    return this.amountGoValue;
  }

  get amountReturn(): Amount {
    return this.amountReturnValue;
  }

  get driveChange(): Amount {
    return this.driveChangeValue;
  }

  get total(): Amount {
    return this.totalAmount;
  }
}
