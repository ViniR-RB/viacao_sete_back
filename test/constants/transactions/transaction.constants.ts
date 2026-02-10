import { Amount } from '@/core/value-objects/amount';
import SplitPaymentEntity from '@/modules/transactions/domain/entities/split_payment.entity';
import TransactionLineDetailsEntity from '@/modules/transactions/domain/entities/transaction_line_details.entity';
import { TransactionType } from '@/modules/transactions/domain/types/transaction-type';

// Split Payment Fixtures
export const VALID_SPLIT_PAYMENT_1 = SplitPaymentEntity.create({
  paymentMethodId: 'pm-123',
  transactionId: 'tx-123',
  amount: 10000,
});

export const VALID_SPLIT_PAYMENT_2 = SplitPaymentEntity.create({
  paymentMethodId: 'pm-456',
  transactionId: 'tx-123',
  amount: 5000,
});

export const VALID_SPLIT_PAYMENT_3 = SplitPaymentEntity.create({
  paymentMethodId: 'pm-789',
  transactionId: 'tx-123',
  amount: 5000,
});

// Split Payments Lists
export const SPLIT_PAYMENTS_MATCHING_AMOUNT = [VALID_SPLIT_PAYMENT_1];

export const SPLIT_PAYMENTS_MULTIPLE_MATCHING = [
  VALID_SPLIT_PAYMENT_1,
  VALID_SPLIT_PAYMENT_2,
  VALID_SPLIT_PAYMENT_3,
];

export const SPLIT_PAYMENTS_NOT_MATCHING = [
  SplitPaymentEntity.create({
    paymentMethodId: 'pm-invalid',
    transactionId: 'tx-123',
    amount: 5000,
  }),
];

export const SPLIT_PAYMENTS_PARTIAL = [
  SplitPaymentEntity.create({
    paymentMethodId: 'pm-partial',
    transactionId: 'tx-123',
    amount: 5000,
  }),
];

// Base Transaction Props (sem split payments, para customização)
export const BASE_TRANSACTION_WITHOUT_LINE_DETAILS = {
  userId: 1,
  categoryId: 'cat-123',
  description: 'Transação válida sem detalhes de linha',
  amountInCents: 10000,
  transactionLineDetails: null,
  type: TransactionType.INCOME,
  createdAt: null,
};

export const VALID_TRANSACTION_WITHOUT_LINE_DETAILS = {
  ...BASE_TRANSACTION_WITHOUT_LINE_DETAILS,
  splitPayments: SPLIT_PAYMENTS_MATCHING_AMOUNT,
};

export const VALID_LINE_DETAILS = TransactionLineDetailsEntity.create({
  transactionId: 'tx-123',
  amountGo: Amount.fromCents(5000),
  amountReturn: Amount.fromCents(2000),
  driveChange: Amount.fromCents(1000),
});

export const VALID_TRANSACTION_WITH_LINE_DETAILS = {
  userId: 2,
  categoryId: 'cat-456',
  description: 'Transação válida com detalhes de linha',
  amountInCents: null,
  transactionLineDetails: VALID_LINE_DETAILS,
  splitPayments: SPLIT_PAYMENTS_MULTIPLE_MATCHING,
  type: TransactionType.EXPENSE,
  createdAt: null,
};

export const LINE_DETAILS_ONLY_AMOUNT_GO = TransactionLineDetailsEntity.create({
  transactionId: 'tx-456',
  amountGo: Amount.fromCents(10000),
  amountReturn: Amount.fromCents(0),
  driveChange: Amount.fromCents(0),
});

export const LINE_DETAILS_ALL_COMPONENTS = TransactionLineDetailsEntity.create({
  transactionId: 'tx-789',
  amountGo: Amount.fromCents(10000),
  amountReturn: Amount.fromCents(5000),
  driveChange: Amount.fromCents(2500),
});

export const LINE_DETAILS_ZERO_TOTAL = TransactionLineDetailsEntity.create({
  transactionId: 'tx-zero',
  amountGo: Amount.fromCents(0),
  amountReturn: Amount.fromCents(0),
  driveChange: Amount.fromCents(0),
});

export const TRANSACTION_VALID_DATA = {
  userId: 1,
  categoryId: 'category-123',
  description: 'Test transaction',
  amount: Amount.fromCents(10000),
  type: TransactionType.INCOME,
  transactionLineDetailsId: null,
  splitPayments: SPLIT_PAYMENTS_MATCHING_AMOUNT,
  createdAt: null,
};

export const TRANSACTION_WITHOU_TRANSACTION_LINE_DETAILS = {
  userId: 1,
  categoryId: 'category-123',
  description: 'Test transaction',
  amount: Amount.fromCents(10000),
  type: TransactionType.INCOME,
  transactionLineDetailsId: null,
  splitPayments: SPLIT_PAYMENTS_MATCHING_AMOUNT,
  createdAt: null,
};

// Split Payments Input for Update
export const VALID_SPLIT_PAYMENT_INPUT_1 = {
  id: VALID_SPLIT_PAYMENT_1.id,
  paymentMethodId: 'pm-123',
  amount: 10000,
};

export const VALID_SPLIT_PAYMENT_INPUT_2 = {
  id: VALID_SPLIT_PAYMENT_2.id,
  paymentMethodId: 'pm-456',
  amount: 5000,
};

export const VALID_SPLIT_PAYMENT_INPUT_3 = {
  id: VALID_SPLIT_PAYMENT_3.id,
  paymentMethodId: 'pm-789',
  amount: 5000,
};

export const SPLIT_PAYMENT_INPUTS_SINGLE = [VALID_SPLIT_PAYMENT_INPUT_1];

export const SPLIT_PAYMENT_INPUTS_MULTIPLE = [
  VALID_SPLIT_PAYMENT_INPUT_1,
  VALID_SPLIT_PAYMENT_INPUT_2,
];

export const SPLIT_PAYMENT_INPUTS_MULTIPLE_ALL = [
  VALID_SPLIT_PAYMENT_INPUT_1,
  VALID_SPLIT_PAYMENT_INPUT_2,
  VALID_SPLIT_PAYMENT_INPUT_3,
];

export const SPLIT_PAYMENT_INPUT_INVALID = {
  id: 'sp-invalid',
  paymentMethodId: 'pm-invalid',
  amount: 5000,
};
