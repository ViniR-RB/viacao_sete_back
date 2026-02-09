import { Amount } from '@/core/value-objects/amount';
import SplitPaymentEntity from '@/modules/transactions/domain/entities/split_payment.entity';
import TransactionLineDetailsEntity from '@/modules/transactions/domain/entities/transaction_line_details.entity';
import { TransactionType } from '@/modules/transactions/domain/types/transaction-type';
import TransactionDomainException from '@/modules/transactions/exceptions/transaction_domain.exception';

export interface TransactionEntityProps {
  id: string;
  userId: number | null;
  categoryId: string;
  description: string;
  amount: Amount;
  type: TransactionType;
  splitPayments: SplitPaymentEntity[];
  transactionLineDetails: TransactionLineDetailsEntity | null;
  attachmentsIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export default class TransactionEntity {
  private constructor(private readonly props: TransactionEntityProps) {}

  static create(
    props: Omit<
      TransactionEntityProps,
      | 'id'
      | 'createdAt'
      | 'updatedAt'
      | 'attachmentsIds'
      | 'splitPayments'
      | 'amount'
    > & {
      id?: string;
      amountInCents: number | null;
      splitPayments: SplitPaymentEntity[];
      createdAt: Date | null;
    },
  ) {
    const propsValid: TransactionEntityProps = {
      ...props,
      id: props.id || crypto.randomUUID(),
      attachmentsIds: [],
      amount: this.calculateAmount(
        props.amountInCents,
        props.transactionLineDetails,
      ),
      splitPayments: props.splitPayments,
      createdAt: props.createdAt || new Date(),
      updatedAt: new Date(),
    };
    this.validate(propsValid);
    this.validateAmountBasedInSplitPayment(
      propsValid.amount,
      propsValid.splitPayments,
    );
    return new TransactionEntity(propsValid);
  }

  static fromData(props: TransactionEntityProps) {
    return new TransactionEntity(props);
  }

  private static calculateAmount(
    amountInCents: number | null,
    transactionLineDetails: TransactionLineDetailsEntity | null,
  ): Amount {
    const hasAmount = amountInCents !== null;
    const hasLineDetails = transactionLineDetails !== null;
    if (!hasAmount && !hasLineDetails) {
      throw new TransactionDomainException(
        'Either amount or transaction line details must be provided',
      );
    }

    if (hasLineDetails) {
      return transactionLineDetails.getTotalAmount();
    }

    return Amount.fromCents(amountInCents!);
  }

  private static validateAmountBasedInSplitPayment(
    totalAmount: Amount,
    splitPayments: SplitPaymentEntity[],
  ) {
    const totalSplitAmount = splitPayments.reduce(
      (acc, sp) => acc + sp.amount.inCents,
      0,
    );

    if (totalAmount.inCents !== totalSplitAmount) {
      throw new TransactionDomainException(
        'The sum of split payments must equal the total transaction amount',
      );
    }
  }

  update(data: {
    description?: string;
    type?: TransactionType;
    amountInCents?: number | null;
    categoryId?: string;
    transactionLineDetails?: TransactionLineDetailsEntity | null;
    splitPayments?: SplitPaymentEntity[];
    createdAt?: Date;
  }) {
    if (data.description !== undefined) {
      this.props.description = data.description;
    }

    if (data.type !== undefined) {
      this.props.type = data.type;
    }

    if (data.categoryId !== undefined) {
      this.props.categoryId = data.categoryId;
    }
    if (data.createdAt !== undefined) {
      this.props.createdAt = new Date(data.createdAt);
    }
    if (data.splitPayments !== undefined) {
      this.props.splitPayments = data.splitPayments;
    }

    // Recalcular amount se amountInCents ou transactionLineDetails foram alterados
    if (
      typeof data.amountInCents === 'number' ||
      data.transactionLineDetails instanceof TransactionLineDetailsEntity
    ) {
      const newAmountInCents =
        data.amountInCents !== undefined ? data.amountInCents : null;

      const newLineDetails =
        data.transactionLineDetails !== undefined
          ? data.transactionLineDetails
          : this.props.transactionLineDetails;

      this.props.amount = TransactionEntity.calculateAmount(
        newAmountInCents,
        newLineDetails,
      );

      if (data.transactionLineDetails !== undefined) {
        this.props.transactionLineDetails = data.transactionLineDetails;
      }
    }

    TransactionEntity.validate({
      userId: this.props.userId,
      categoryId: this.props.categoryId,
      description: this.props.description,
      amount: this.props.amount,
      type: this.props.type,
      splitPayments: this.props.splitPayments,
      transactionLineDetails: this.props.transactionLineDetails,
    });

    TransactionEntity.validateAmountBasedInSplitPayment(
      this.props.amount,
      this.props.splitPayments,
    );

    this.toTouch();
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
    if (
      !Array.isArray(props.splitPayments) ||
      props.splitPayments.length === 0
    ) {
      throw new TransactionDomainException('Split payments are required');
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

  get transactionLineDetails() {
    return this.props.transactionLineDetails;
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

  get splitPayments() {
    return this.props.splitPayments;
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
      splitPayments: this.props.splitPayments.map(sp => sp.toObject()),
      amount: this.props.amount.getValue,
      attachmentsIds: this.props.attachmentsIds,
      type: this.props.type,
      transactionLineDetails: this.props.transactionLineDetails
        ? this.props.transactionLineDetails.toObject()
        : null,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }
}
