import { Amount } from '@/core/value-objects/amount';
import { TransactionType } from '@/modules/transactions/domain/types/transaction-type';
import TransactionDomainException from '@/modules/transactions/exceptions/transaction_domain.exception';

export interface TransactionEntityProps {
  id: string;
  userId: number | null;
  categoryId: string;
  description: string;
  amount: Amount;
  type: TransactionType;
  createdAt: Date;
  updatedAt: Date;
}

export default class TransactionEntity {
  private constructor(private readonly props: TransactionEntityProps) {}

  static create(
    props: Omit<TransactionEntityProps, 'id' | 'createdAt' | 'updatedAt'> & {
      id?: string;
      createdAt?: Date;
    },
  ) {
    this.validate(props);

    return new TransactionEntity({
      ...props,
      id: props.id || crypto.randomUUID(),
      createdAt: props.createdAt || new Date(),
      updatedAt: new Date(),
    });
  }

  static fromData(props: TransactionEntityProps) {
    return new TransactionEntity(props);
  }

  private static validate(
    props: Omit<TransactionEntityProps, 'id' | 'createdAt' | 'updatedAt'>,
  ) {
    if (props.userId === undefined) {
      throw new TransactionDomainException('User ID is required');
    }
    if (!props.categoryId) {
      throw new TransactionDomainException('Category ID is required');
    }
    if (!props.description || props.description.trim().length < 3) {
      throw new TransactionDomainException('Description is required');
    }
    if (!props.amount || !(props.amount instanceof Amount)) {
      throw new TransactionDomainException(
        'Amount must be a valid Amount value object',
      );
    }
    if (!Object.values(TransactionType).includes(props.type)) {
      throw new TransactionDomainException('Invalid transaction type');
    }
  }

  get id() {
    return this.props.id;
  }

  get userId() {
    return this.props.userId;
  }

  get categoryId() {
    return this.props.categoryId;
  }

  get description() {
    return this.props.description;
  }

  get amount() {
    return this.props.amount;
  }

  get type() {
    return this.props.type;
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
      userId: this.props.userId,
      categoryId: this.props.categoryId,
      description: this.props.description,
      amount: this.props.amount.inReais,
      type: this.props.type,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }
}
