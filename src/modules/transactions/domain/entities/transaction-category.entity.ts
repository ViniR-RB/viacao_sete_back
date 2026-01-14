import TransactionCategoryType from '@/modules/transactions/domain/entities/transaction_category_enum';
import TransactionCategoryDomainException from '@/modules/transactions/exceptions/transaction_category_domain.exception';

export interface TransactionCategoryEntityProps {
  id: string;
  userId: number | null;
  name: string;
  description: string | null;
  types: TransactionCategoryType[];
  createdAt: Date;
  updatedAt: Date;
}

export default class TransactionCategoryEntity {
  private constructor(private readonly props: TransactionCategoryEntityProps) {
    this.props = {
      id: props.id,
      userId: props.userId,
      name: props.name,
      types: props.types,
      description: props.description,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    };
  }

  static validate(props: Partial<TransactionCategoryEntityProps>) {
    if (props.name && props.name?.length < 3) {
      throw new TransactionCategoryDomainException(
        'Name must be at least 3 characters long',
      );
    }
    if (props.description && props.description?.length < 3) {
      throw new TransactionCategoryDomainException(
        'Description must be at least 3 characters long',
      );
    }
    if (
      !props.types ||
      props.types.length === 0 ||
      props.types.some(
        type => !Object.values(TransactionCategoryType).includes(type),
      )
    ) {
      throw new TransactionCategoryDomainException(
        'At least one category type must be specified',
      );
    }
    if (
      props.types.length >= 2 &&
      props.types.includes(TransactionCategoryType.COMMON)
    ) {
      throw new TransactionCategoryDomainException(
        'Transaction category the type Common cannot be combined with other types',
      );
    }
  }

  static create(
    props: Omit<
      TransactionCategoryEntityProps,
      'id' | 'createdAt' | 'updatedAt'
    > & {
      id?: string;
    },
  ) {
    this.validate(props);
    return new TransactionCategoryEntity({
      ...props,
      id: props.id ? props.id : crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static fromData(props: TransactionCategoryEntityProps) {
    return new TransactionCategoryEntity(props);
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

  get types() {
    return this.props.types;
  }

  get userId() {
    return this.props.userId;
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
      name: this.props.name,
      types: this.props.types,
      description: this.props.description,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }
}
