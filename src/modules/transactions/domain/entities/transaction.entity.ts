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
  transactionLineDetailsId: string | null;
  attachmentsIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export default class TransactionEntity {
  private constructor(private readonly props: TransactionEntityProps) {}

  static create(
    props: Omit<
      TransactionEntityProps,
      'id' | 'createdAt' | 'updatedAt' | 'attachmentsIds'
    > & {
      id?: string;
      createdAt: Date | null;
    },
  ) {
    this.validate(props);

    return new TransactionEntity({
      ...props,
      id: props.id || crypto.randomUUID(),
      attachmentsIds: [],
      createdAt: props.createdAt || new Date(),
      updatedAt: new Date(),
    });
  }

  static fromData(props: TransactionEntityProps) {
    return new TransactionEntity(props);
  }

  private static validate(
    props: Omit<
      TransactionEntityProps,
      'id' | 'createdAt' | 'updatedAt' | 'attachmentsIds'
    >,
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
    if (props.amount.inCents <= 0) {
      throw new TransactionDomainException('Amount must be greater than zero');
    }
  }

  addAttachment(attachmentId: string) {
    const attachmentAlreadyExists =
      this.props.attachmentsIds.includes(attachmentId);
    if (attachmentAlreadyExists) {
      throw new TransactionDomainException(
        'Attachment already added to this transaction',
      );
    }
    this.props.attachmentsIds.push(attachmentId);
    this.toTouch();
  }

  private toTouch() {
    this.props.updatedAt = new Date();
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
  get transactionLineDetailsId() {
    return this.props.transactionLineDetailsId;
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

  get attachmentsIds() {
    return this.props.attachmentsIds;
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
      transactionLineDetailsId: this.props.transactionLineDetailsId,
      amount: this.props.amount.getValue,
      attachmentsIds: this.props.attachmentsIds,
      type: this.props.type,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }
}
