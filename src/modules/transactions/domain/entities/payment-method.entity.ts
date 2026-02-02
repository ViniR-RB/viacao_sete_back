import PaymentMethodDomainException from '@modules/transactions/exceptions/payment_method_domain.exception';

export interface PaymentMethodEntityProps {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export default class PaymentMethodEntity {
  private constructor(private readonly props: PaymentMethodEntityProps) {}

  static create(
    props: Omit<PaymentMethodEntityProps, 'id' | 'createdAt' | 'updatedAt'> & {
      id?: string;
    },
  ) {
    this.validate(props);

    return new PaymentMethodEntity({
      ...props,
      id: props.id ? props.id : crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static fromData(props: PaymentMethodEntityProps) {
    return new PaymentMethodEntity(props);
  }

  static validate(
    props: Omit<PaymentMethodEntityProps, 'id' | 'createdAt' | 'updatedAt'>,
  ) {
    if (!props.name || props.name.trim().length < 3) {
      throw new PaymentMethodDomainException(
        'Payment method name must be at least 3 characters long',
      );
    }
    if (props.description && props.description.trim().length < 3) {
      throw new PaymentMethodDomainException(
        'Payment method description must be at least 3 characters long',
      );
    }
  }

  get id() {
    return this.props.id;
  }

  get name() {
    return this.props.name;
  }

  get description() {
    return this.props.description;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  toObject() {
    return {
      id: this.props.id,
      name: this.props.name,
      description: this.props.description,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }
}
