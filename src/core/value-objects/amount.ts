export class Amount {
  private readonly cents: bigint;

  private constructor(cents: bigint | number) {
    this.validate(cents);
    this.cents = BigInt(cents);
  }

  static fromReais(reais: number): Amount {
    return new Amount(Math.round(reais * 100));
  }

  static fromCents(cents: number | bigint): Amount {
    return new Amount(cents);
  }

  private validate(cents: bigint | number): void {
    if (typeof cents === 'number' && !Number.isFinite(cents)) {
      throw new Error('Amount must be a finite number');
    }
  }

  get value(): bigint {
    return this.cents;
  }

  get inReais(): number {
    return Number(this.cents) / 100;
  }

  get inCents(): bigint {
    return this.cents;
  }

  equals(other: Amount): boolean {
    return this.cents === other.cents;
  }

  toString(): string {
    return `R$ ${(Number(this.cents) / 100).toFixed(2)}`;
  }

  toJSON(): number {
    return this.inReais;
  }
}
