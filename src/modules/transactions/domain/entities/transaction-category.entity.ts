export interface TransactionCategoryEntityProps {
  id: string;
  userId: number | null;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export default class TransactionCategoryEntity {
  private constructor(private readonly props: TransactionCategoryEntityProps) {
    this.props = {
      id: props.id,
      userId: props.userId,
      name: props.name,
      description: props.description,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    };
  }

  static create(
    props: Omit<
      TransactionCategoryEntityProps,
      'id' | 'createdAt' | 'updatedAt'
    > & {
      id?: string;
    },
  ) {
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
      description: this.props.description,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }
}
