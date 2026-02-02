import { Amount } from '@/core/value-objects/amount';
import TransactionEntity, {
  TransactionEntityProps,
} from '@/modules/transactions/domain/entities/transaction.entity';
import { TransactionType } from '@/modules/transactions/domain/types/transaction-type';
import TransactionDomainException from '@/modules/transactions/exceptions/transaction_domain.exception';

describe('TransactionEntity', () => {
  const createValidProps = (): Omit<
    TransactionEntityProps,
    'id' | 'createdAt' | 'updatedAt' | 'attachmentsIds' | 'paymentMethodId'
  > & {
    id?: string;
    paymentMethodId: string;
    createdAt: Date | null;
  } => ({
    userId: 1,
    categoryId: 'category-123',
    description: 'Test transaction',
    paymentMethodId: 'payment-method-123',
    amount: Amount.fromCents(10000),
    type: TransactionType.INCOME,
    transactionLineDetailsId: null,
    createdAt: null,
  });

  describe('create', () => {
    it('should create a transaction with valid props', () => {
      // Arrange
      const validProps = createValidProps();

      // Act
      const transaction = TransactionEntity.create(validProps);

      // Assert
      expect(transaction).toBeInstanceOf(TransactionEntity);
      expect(transaction.userId).toBe(1);
      expect(transaction.categoryId).toBe('category-123');
      expect(transaction.description).toBe('Test transaction');
      expect(transaction.type).toBe(TransactionType.INCOME);
      expect(transaction.amount.inCents).toBe(10000);
      expect(transaction.id).toBeDefined();
      expect(transaction.createdAt).toBeDefined();
      expect(transaction.updatedAt).toBeDefined();
      expect(transaction.attachmentsIds).toEqual([]);
    });

    it('should generate a random UUID if id is not provided', () => {
      // Arrange
      const validProps = createValidProps();

      // Act
      const transaction = TransactionEntity.create(validProps);

      // Assert
      expect(transaction.id).toBeDefined();
      expect(transaction.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      );
    });

    it('should use provided id if available', () => {
      // Arrange
      const validProps = createValidProps();
      const providedId = 'custom-id-123';

      // Act
      const transaction = TransactionEntity.create({
        ...validProps,
        id: providedId,
      });

      // Assert
      expect(transaction.id).toBe(providedId);
    });

    it('should set createdAt to current date if not provided', () => {
      // Arrange
      const validProps = createValidProps();
      const beforeCreate = new Date();

      // Act
      const transaction = TransactionEntity.create(validProps);
      const afterCreate = new Date();

      // Assert
      expect(transaction.createdAt).toBeDefined();
      expect(transaction.createdAt.getTime()).toBeGreaterThanOrEqual(
        beforeCreate.getTime(),
      );
      expect(transaction.createdAt.getTime()).toBeLessThanOrEqual(
        afterCreate.getTime(),
      );
    });

    it('should use provided createdAt if available', () => {
      // Arrange
      const validProps = createValidProps();
      const customDate = new Date('2025-01-01');

      // Act
      const transaction = TransactionEntity.create({
        ...validProps,
        createdAt: customDate,
      });

      // Assert
      expect(transaction.createdAt).toEqual(customDate);
    });

    it('should throw error if userId is undefined', () => {
      // Arrange
      const invalidProps = createValidProps();
      delete (invalidProps as any).userId;

      // Act & Assert
      expect(() => TransactionEntity.create(invalidProps as any)).toThrow(
        TransactionDomainException,
      );
    });

    it('should throw error if categoryId is empty', () => {
      // Arrange
      const invalidProps = createValidProps();
      invalidProps.categoryId = '';

      // Act & Assert
      expect(() => TransactionEntity.create(invalidProps)).toThrow(
        TransactionDomainException,
      );
    });

    it('should throw error if description is empty', () => {
      // Arrange
      const invalidProps = createValidProps();
      invalidProps.description = '';

      // Act & Assert
      expect(() => TransactionEntity.create(invalidProps)).toThrow(
        TransactionDomainException,
      );
    });

    it('should throw error if description has less than 3 characters', () => {
      // Arrange
      const invalidProps = createValidProps();
      invalidProps.description = 'ab';

      // Act & Assert
      expect(() => TransactionEntity.create(invalidProps)).toThrow(
        TransactionDomainException,
      );
    });

    it('should throw error if amount is not an Amount instance', () => {
      // Arrange
      const invalidProps = createValidProps();
      (invalidProps as any).amount = 10000;

      // Act & Assert
      expect(() => TransactionEntity.create(invalidProps)).toThrow(
        TransactionDomainException,
      );
    });

    it('should throw error if amount is zero or negative', () => {
      // Arrange
      const invalidProps = createValidProps();
      invalidProps.amount = Amount.fromCents(0);

      // Act & Assert
      expect(() => TransactionEntity.create(invalidProps)).toThrow(
        TransactionDomainException,
      );
    });

    it('should throw error if transaction type is invalid', () => {
      // Arrange
      const invalidProps = createValidProps();
      (invalidProps as any).type = 'INVALID_TYPE';

      // Act & Assert
      expect(() => TransactionEntity.create(invalidProps)).toThrow(
        TransactionDomainException,
      );
    });
  });

  describe('fromData', () => {
    it('should create a transaction from existing data', () => {
      // Arrange
      const createdAt = new Date('2025-01-01');
      const updatedAt = new Date('2025-01-02');
      const props: TransactionEntityProps = {
        id: 'trans-123',
        userId: 2,
        categoryId: 'cat-456',
        description: 'Existing transaction',
        amount: Amount.fromCents(5000),
        type: TransactionType.EXPENSE,
        transactionLineDetailsId: 'line-789',
        attachmentsIds: ['attach-1', 'attach-2'],
        paymentMethodId: 'payment-method-123',
        createdAt,
        updatedAt,
      };

      // Act
      const transaction = TransactionEntity.fromData(props);

      // Assert
      expect(transaction.id).toBe('trans-123');
      expect(transaction.userId).toBe(2);
      expect(transaction.categoryId).toBe('cat-456');
      expect(transaction.description).toBe('Existing transaction');
      expect(transaction.type).toBe(TransactionType.EXPENSE);
      expect(transaction.amount.inCents).toBe(5000);
      expect(transaction.transactionLineDetailsId).toBe('line-789');
      expect(transaction.attachmentsIds).toEqual(['attach-1', 'attach-2']);
      expect(transaction.createdAt).toEqual(createdAt);
      expect(transaction.updatedAt).toEqual(updatedAt);
    });
  });

  describe('addAttachment', () => {
    it('should add an attachment to the transaction', () => {
      // Arrange
      const transaction = TransactionEntity.create(createValidProps());
      const attachmentId = 'attach-123';

      // Act
      transaction.addAttachment(attachmentId);

      // Assert
      expect(transaction.attachmentsIds).toContain(attachmentId);
      expect(transaction.attachmentsIds.length).toBe(1);
    });

    it('should add multiple different attachments', () => {
      // Arrange
      const transaction = TransactionEntity.create(createValidProps());
      const attachmentId1 = 'attach-1';
      const attachmentId2 = 'attach-2';
      const attachmentId3 = 'attach-3';

      // Act
      transaction.addAttachment(attachmentId1);
      transaction.addAttachment(attachmentId2);
      transaction.addAttachment(attachmentId3);

      // Assert
      expect(transaction.attachmentsIds).toEqual([
        attachmentId1,
        attachmentId2,
        attachmentId3,
      ]);
    });

    it('should throw error when adding duplicate attachment', () => {
      // Arrange
      const transaction = TransactionEntity.create(createValidProps());
      const attachmentId = 'attach-123';
      transaction.addAttachment(attachmentId);

      // Act & Assert
      expect(() => transaction.addAttachment(attachmentId)).toThrow(
        TransactionDomainException,
      );
    });

    it('should update updatedAt when adding an attachment', () => {
      // Arrange
      const transaction = TransactionEntity.create(createValidProps());
      const originalUpdatedAt = transaction.updatedAt;
      const attachmentId = 'attach-123';

      // Add small delay to ensure time difference
      const delay = new Promise(resolve => setTimeout(resolve, 10));

      // Act
      return delay.then(() => {
        transaction.addAttachment(attachmentId);

        // Assert
        expect(transaction.updatedAt.getTime()).toBeGreaterThan(
          originalUpdatedAt.getTime(),
        );
      });
    });
  });

  describe('getters', () => {
    it('should return all properties correctly', () => {
      // Arrange
      const validProps = createValidProps();
      const transaction = TransactionEntity.create(validProps);

      // Act & Assert
      expect(transaction.id).toBeDefined();
      expect(transaction.userId).toBe(validProps.userId);
      expect(transaction.categoryId).toBe(validProps.categoryId);
      expect(transaction.description).toBe(validProps.description);
      expect(transaction.amount).toEqual(validProps.amount);
      expect(transaction.type).toBe(validProps.type);
      expect(transaction.createdAt).toBeDefined();
      expect(transaction.updatedAt).toBeDefined();
      expect(transaction.attachmentsIds).toEqual([]);
      expect(transaction.transactionLineDetailsId).toBeNull();
    });
  });

  describe('toObject', () => {
    it('should return a plain object with all properties', () => {
      // Arrange
      const validProps = createValidProps();
      const transaction = TransactionEntity.create(validProps);

      // Act
      const result = transaction.toObject();

      // Assert
      expect(result).toEqual({
        id: transaction.id,
        userId: validProps.userId,
        categoryId: validProps.categoryId,
        description: validProps.description,
        transactionLineDetailsId: null,
        paymentMethodId: validProps.paymentMethodId,
        amount: validProps.amount.getValue,
        attachmentsIds: [],
        type: validProps.type,
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt,
      });
    });

    it('should return amount in reais (getValue)', () => {
      // Arrange
      const validProps = createValidProps();
      validProps.amount = Amount.fromCents(10050);
      const transaction = TransactionEntity.create(validProps);

      // Act
      const result = transaction.toObject();

      // Assert
      expect(result.amount).toBe(100.5);
    });

    it('should include attachments in the returned object', () => {
      // Arrange
      const transaction = TransactionEntity.create(createValidProps());
      transaction.addAttachment('attach-1');
      transaction.addAttachment('attach-2');

      // Act
      const result = transaction.toObject();

      // Assert
      expect(result.attachmentsIds).toEqual(['attach-1', 'attach-2']);
    });
  });
});
