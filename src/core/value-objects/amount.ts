export class Amount {
  private readonly cents: number;

  private constructor(cents: number) {
    this.validate(cents);
    this.cents = cents;
  }

  /**
   * Cria um Amount a partir de um valor em reais
   * @param reais valor em reais (ex: 10.50)
   */
  static from(reais: number): Amount {
    const cents = Math.round(reais * 100);
    return new Amount(cents);
  }

  /**
   * Cria um Amount a partir de um valor em centavos
   * @param cents valor em centavos (ex: 1050)
   */
  static fromCents(cents: number): Amount {
    return new Amount(cents);
  }

  private validate(cents: number): void {
    if (!Number.isFinite(cents)) {
      throw new Error('Amount must be a finite number');
    }
  }

  /**
   * Retorna o valor em reais
   */
  get getValue(): number {
    return this.cents / 100;
  }

  /**
   * Retorna o valor em centavos
   */
  get inCents(): number {
    return this.cents;
  }

  /**
   * Soma dois amounts (operação em centavos)
   */
  add(other: Amount): Amount {
    return new Amount(this.cents + other.cents);
  }

  /**
   * Subtrai dois amounts (operação em centavos)
   */
  subtract(other: Amount): Amount {
    return new Amount(this.cents - other.cents);
  }

  equals(other: Amount): boolean {
    return this.cents === other.cents;
  }

  toString(): string {
    return `R$ ${(this.cents / 100).toFixed(2)}`;
  }

  toJSON(): number {
    return this.getValue;
  }
}
