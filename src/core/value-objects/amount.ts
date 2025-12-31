export class Amount {
  private readonly cents: number;

  private constructor(cents: number) {
    this.validate(cents);
    this.cents = Math.round(cents);
  }

  static fromReais(reais: number): Amount {
    return new Amount(reais * 100);
  }

  static fromCents(cents: number): Amount {
    return new Amount(cents);
  }

  private validate(cents: number): void {
    if (!Number.isFinite(cents)) {
      throw new Error('Amount must be a finite number');
    }
  }

  get value(): number {
    return this.cents;
  }

  get inReais(): number {
    return this.cents / 100;
  }

  get inCents(): number {
    return this.cents;
  }

  equals(other: Amount): boolean {
    return this.cents === other.cents;
  }

  toString(): string {
    return `R$ ${(this.cents / 100).toFixed(2)}`;
  }

  toJSON(): number {
    return this.inReais;
  }
}
