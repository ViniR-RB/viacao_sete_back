import { Amount } from '@/core/value-objects/amount';

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
    this.amountGoValue = Amount.from(props.amountGo);
    this.amountReturnValue = Amount.from(props.amountReturn);
    this.driveChangeValue = Amount.from(props.driveChange);

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
    // Validação é feita no constructor de Amount
    // Se algum valor fosse inválido, Amount.from() já teria lançado exceção
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
