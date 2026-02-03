import { Amount } from '@/core/value-objects/amount';
import TransactionLineDetailsEntity from '@/modules/transactions/domain/entities/transaction_line_details.entity';
import { TransactionType } from '@/modules/transactions/domain/types/transaction-type';

export const VALID_TRANSACTION_WITHOUT_LINE_DETAILS = {
  userId: 1,
  categoryId: 'cat-123',
  description: 'Transação válida sem detalhes de linha',
  paymentMethodId: 'pm-123',
  amountInCents: 10000,
  transactionLineDetails: null,
  type: TransactionType.INCOME,
  createdAt: null,
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
  paymentMethodId: 'pm-456',
  amountInCents: null,
  transactionLineDetails: VALID_LINE_DETAILS,
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
  paymentMethodId: 'payment-method-123',
  amount: Amount.fromCents(10000),
  type: TransactionType.INCOME,
  transactionLineDetailsId: null,
  createdAt: null,
};

export const TRANSACTION_WITHOU_TRANSACTION_LINE_DETAILS = {
  userId: 1,
  categoryId: 'category-123',
  description: 'Test transaction',
  paymentMethodId: 'payment-method-123',
  amount: Amount.fromCents(10000),
  type: TransactionType.INCOME,
  transactionLineDetailsId: null,
  createdAt: null,
};
