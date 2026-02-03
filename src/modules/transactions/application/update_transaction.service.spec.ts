import AppException from '@/core/exceptions/app_exception';
import IUnitOfWork from '@/core/interface/i_unit_of_work';
import { left, right } from '@/core/types/either';
import { Amount } from '@/core/value-objects/amount';
import IPaymentMethodRepository from '@/modules/transactions/adapters/i_payment_method.repository';
import ITransactionCategoryRepository from '@/modules/transactions/adapters/i_transaction_category.repository';
import UpdateTransactionService from '@/modules/transactions/application/update_transaction.service';
import TransactionEntity from '@/modules/transactions/domain/entities/transaction.entity';
import TransactionLineDetailsEntity from '@/modules/transactions/domain/entities/transaction_line_details.entity';
import { TransactionType } from '@/modules/transactions/domain/types/transaction-type';
import {
  VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
  VALID_TRANSACTION_WITH_LINE_DETAILS,
} from '@test/constants/transactions/transaction.constants';

describe('UpdateTransactionService', () => {
  let service: UpdateTransactionService;
  let mockUnitOfWork: jest.Mocked<IUnitOfWork>;
  let mockCategoryRepository: jest.Mocked<ITransactionCategoryRepository>;
  let mockPaymentMethodRepository: jest.Mocked<IPaymentMethodRepository>;
  let mockTransactionRepository: any;

  beforeEach(async () => {
    // Setup mock repositories
    mockTransactionRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
    };

    mockUnitOfWork = {
      start: jest.fn(),
      commit: jest.fn(),
      rollback: jest.fn(),
      getTransactionRepository: jest
        .fn()
        .mockReturnValue(mockTransactionRepository),
    } as any;

    mockCategoryRepository = {
      findOneById: jest.fn(),
    } as any;

    mockPaymentMethodRepository = {
      findOneById: jest.fn(),
    } as any;

    // Initialize service with mocked dependencies
    service = new UpdateTransactionService(
      mockUnitOfWork,
      mockCategoryRepository,
      mockPaymentMethodRepository,
    );
  });

  describe('Success Scenarios - Basic Updates', () => {
    it('should update transaction with description only', async () => {
      // Arrange
      const transaction = TransactionEntity.create(
        VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
      );
      const newDescription = 'Updated description';
      mockTransactionRepository.findOne.mockResolvedValue(right(transaction));
      mockTransactionRepository.save.mockResolvedValue(right(transaction));

      // Act
      const result = await service.execute({
        id: transaction.id,
        description: newDescription,
        amount: 10000,
      });

      // Assert
      expect(mockUnitOfWork.start).toHaveBeenCalledTimes(1);
      expect(mockUnitOfWork.commit).toHaveBeenCalledTimes(1);
      expect(mockUnitOfWork.rollback).not.toHaveBeenCalled();
      expect(result.isRight()).toBe(true);
    });

    it('should update transaction with type only', async () => {
      // Arrange
      const transaction = TransactionEntity.create(
        VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
      );
      mockTransactionRepository.findOne.mockResolvedValue(right(transaction));
      mockTransactionRepository.save.mockResolvedValue(right(transaction));

      // Act
      const result = await service.execute({
        id: transaction.id,
        type: TransactionType.EXPENSE,
        amount: 10000,
      });

      // Assert
      expect(result.isRight()).toBe(true);
      expect(mockUnitOfWork.commit).toHaveBeenCalled();
    });

    it('should update transaction with amount only', async () => {
      // Arrange
      const transaction = TransactionEntity.create(
        VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
      );
      mockTransactionRepository.findOne.mockResolvedValue(right(transaction));
      mockTransactionRepository.save.mockResolvedValue(right(transaction));

      // Act
      const result = await service.execute({
        id: transaction.id,
        amount: 25000,
      });

      // Assert
      expect(result.isRight()).toBe(true);
      expect(mockUnitOfWork.commit).toHaveBeenCalled();
    });
  });

  describe('Success Scenarios - Category Updates', () => {
    it('should update transaction with valid category change', async () => {
      // Arrange
      const transaction = TransactionEntity.create(
        VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
      );
      const newCategoryId = 'cat-new-456';
      mockTransactionRepository.findOne.mockResolvedValue(right(transaction));
      mockCategoryRepository.findOneById.mockResolvedValue(
        right({ id: newCategoryId } as any),
      );
      mockTransactionRepository.save.mockResolvedValue(right(transaction));

      // Act
      const result = await service.execute({
        id: transaction.id,
        categoryId: newCategoryId,
        amount: 10000,
      });

      // Assert
      expect(mockCategoryRepository.findOneById).toHaveBeenCalledWith(
        newCategoryId,
      );
      expect(result.isRight()).toBe(true);
      expect(mockUnitOfWork.commit).toHaveBeenCalled();
    });

    it('should not validate category when categoryId not provided', async () => {
      // Arrange
      const transaction = TransactionEntity.create(
        VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
      );
      mockTransactionRepository.findOne.mockResolvedValue(right(transaction));
      mockTransactionRepository.save.mockResolvedValue(right(transaction));

      // Act
      await service.execute({
        id: transaction.id,
        description: 'Updated without category change',
        amount: 10000,
      });

      // Assert
      expect(mockCategoryRepository.findOneById).not.toHaveBeenCalled();
    });

    it('should not validate category when categoryId matches existing', async () => {
      // Arrange
      const transaction = TransactionEntity.create(
        VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
      );
      mockTransactionRepository.findOne.mockResolvedValue(right(transaction));
      mockTransactionRepository.save.mockResolvedValue(right(transaction));

      // Act
      await service.execute({
        id: transaction.id,
        categoryId: transaction.categoryId,
        amount: 10000,
      });

      // Assert
      expect(mockCategoryRepository.findOneById).not.toHaveBeenCalled();
    });
  });

  describe('Success Scenarios - Payment Method Updates', () => {
    it('should update transaction with valid payment method change', async () => {
      // Arrange
      const transaction = TransactionEntity.create(
        VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
      );
      const newPaymentMethodId = 'pm-new-789';
      mockTransactionRepository.findOne.mockResolvedValue(right(transaction));
      mockPaymentMethodRepository.findOneById.mockResolvedValue(
        right({ id: newPaymentMethodId } as any),
      );
      mockTransactionRepository.save.mockResolvedValue(right(transaction));

      // Act
      const result = await service.execute({
        id: transaction.id,
        paymentMethodId: newPaymentMethodId,
        amount: 10000,
      });

      // Assert
      expect(mockPaymentMethodRepository.findOneById).toHaveBeenCalledWith(
        newPaymentMethodId,
      );
      expect(result.isRight()).toBe(true);
      expect(mockUnitOfWork.commit).toHaveBeenCalled();
    });

    it('should update transaction by setting payment method to null', async () => {
      // Arrange
      const transaction = TransactionEntity.create(
        VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
      );
      mockTransactionRepository.findOne.mockResolvedValue(right(transaction));
      mockTransactionRepository.save.mockResolvedValue(right(transaction));

      // Act
      const result = await service.execute({
        id: transaction.id,
        paymentMethodId: null,
        amount: 10000,
      });

      // Assert
      expect(mockPaymentMethodRepository.findOneById).not.toHaveBeenCalled();
      expect(result.isRight()).toBe(true);
      expect(mockUnitOfWork.commit).toHaveBeenCalled();
    });

    it('should not validate payment method when undefined', async () => {
      // Arrange
      const transaction = TransactionEntity.create(
        VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
      );
      mockTransactionRepository.findOne.mockResolvedValue(right(transaction));
      mockTransactionRepository.save.mockResolvedValue(right(transaction));

      // Act
      await service.execute({
        id: transaction.id,
        amount: 10000,
      });

      // Assert
      expect(mockPaymentMethodRepository.findOneById).not.toHaveBeenCalled();
    });

    it('should not validate payment method when same as existing', async () => {
      // Arrange
      const transaction = TransactionEntity.create(
        VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
      );
      mockTransactionRepository.findOne.mockResolvedValue(right(transaction));
      mockTransactionRepository.save.mockResolvedValue(right(transaction));

      // Act
      await service.execute({
        id: transaction.id,
        paymentMethodId: transaction.paymentMethodId,
        amount: 10000,
      });

      // Assert
      expect(mockPaymentMethodRepository.findOneById).not.toHaveBeenCalled();
    });
  });

  describe('Success Scenarios - Transaction Line Details', () => {
    it('should create transaction line details with all components', async () => {
      // Arrange
      const transaction = TransactionEntity.create(
        VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
      );
      const transactionWithLineDetails = TransactionEntity.create({
        ...VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
        transactionLineDetails: TransactionLineDetailsEntity.create({
          transactionId: transaction.id,
          amountGo: Amount.fromCents(10000),
          amountReturn: Amount.fromCents(5000),
          driveChange: Amount.fromCents(2500),
        }),
      });

      mockTransactionRepository.findOne.mockResolvedValue(right(transaction));
      mockTransactionRepository.save.mockResolvedValue(
        right(transactionWithLineDetails),
      );

      const lineDetailsInput = {
        amountGo: 10000,
        amountReturn: 5000,
        driveChange: 2500,
      };

      // Act
      const result = await service.execute({
        id: transaction.id,
        transactionLineDetails: lineDetailsInput,
      });

      // Assert
      expect(result.isRight()).toBe(true);
      expect(mockTransactionRepository.save).toHaveBeenCalled();
      const savedTransaction = mockTransactionRepository.save.mock.calls[0][0];
      expect(savedTransaction.transactionLineDetails).toBeDefined();
    });

    it('should create transaction line details with only amountGo', async () => {
      // Arrange
      const transaction = TransactionEntity.create(
        VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
      );
      const transactionWithLineDetails = TransactionEntity.create({
        ...VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
        transactionLineDetails: TransactionLineDetailsEntity.create({
          transactionId: transaction.id,
          amountGo: Amount.fromCents(10000),
          amountReturn: Amount.fromCents(0),
          driveChange: Amount.fromCents(0),
        }),
      });

      mockTransactionRepository.findOne.mockResolvedValue(right(transaction));
      mockTransactionRepository.save.mockResolvedValue(
        right(transactionWithLineDetails),
      );

      const lineDetailsInput = {
        amountGo: 10000,
        amountReturn: 0,
        driveChange: 0,
      };

      // Act
      const result = await service.execute({
        id: transaction.id,
        transactionLineDetails: lineDetailsInput,
      });

      // Assert
      expect(result.isRight()).toBe(true);
      expect(mockTransactionRepository.save).toHaveBeenCalled();
    });

    it('should update existing transaction line details', async () => {
      // Arrange
      const transaction = TransactionEntity.create(
        VALID_TRANSACTION_WITH_LINE_DETAILS,
      );
      const updatedTransaction = TransactionEntity.create({
        ...VALID_TRANSACTION_WITH_LINE_DETAILS,
        transactionLineDetails: TransactionLineDetailsEntity.create({
          transactionId: transaction.id,
          amountGo: Amount.fromCents(15000),
          amountReturn: Amount.fromCents(3000),
          driveChange: Amount.fromCents(1500),
        }),
      });

      mockTransactionRepository.findOne.mockResolvedValue(right(transaction));
      mockTransactionRepository.save.mockResolvedValue(
        right(updatedTransaction),
      );

      const newLineDetailsInput = {
        amountGo: 15000,
        amountReturn: 3000,
        driveChange: 1500,
      };

      // Act
      const result = await service.execute({
        id: transaction.id,
        transactionLineDetails: newLineDetailsInput,
      });

      // Assert
      expect(result.isRight()).toBe(true);
      expect(mockTransactionRepository.save).toHaveBeenCalled();
    });

    it('should clear transaction line details when null provided', async () => {
      // Arrange
      const transaction = TransactionEntity.create(
        VALID_TRANSACTION_WITH_LINE_DETAILS,
      );
      const clearedTransaction = TransactionEntity.create({
        ...VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
        id: transaction.id,
        transactionLineDetails: null,
      });

      mockTransactionRepository.findOne.mockResolvedValue(right(transaction));
      mockTransactionRepository.save.mockResolvedValue(
        right(clearedTransaction),
      );

      // Act
      const result = await service.execute({
        id: transaction.id,
        transactionLineDetails: null,
        amount: 10000,
      });

      // Assert
      expect(result.isRight()).toBe(true);
    });
  });

  describe('Success Scenarios - Multiple Fields', () => {
    it('should update multiple fields simultaneously', async () => {
      // Arrange
      const transaction = TransactionEntity.create(
        VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
      );
      mockTransactionRepository.findOne.mockResolvedValue(right(transaction));
      mockCategoryRepository.findOneById.mockResolvedValue(
        right({ id: 'cat-new' } as any),
      );
      mockPaymentMethodRepository.findOneById.mockResolvedValue(
        right({ id: 'pm-new' } as any),
      );
      mockTransactionRepository.save.mockResolvedValue(right(transaction));

      // Act
      const result = await service.execute({
        id: transaction.id,
        description: 'Updated multi-field transaction',
        type: TransactionType.EXPENSE,
        amount: 30000,
        categoryId: 'cat-new',
        paymentMethodId: 'pm-new',
      });

      // Assert
      expect(result.isRight()).toBe(true);
      expect(mockCategoryRepository.findOneById).toHaveBeenCalled();
      expect(mockPaymentMethodRepository.findOneById).toHaveBeenCalled();
      expect(mockUnitOfWork.commit).toHaveBeenCalled();
    });

    it('should update description and line details together', async () => {
      // Arrange
      const transaction = TransactionEntity.create(
        VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
      );
      mockTransactionRepository.findOne.mockResolvedValue(right(transaction));
      mockTransactionRepository.save.mockResolvedValue(right(transaction));

      // Act
      const result = await service.execute({
        id: transaction.id,
        description: 'With line details',
        transactionLineDetails: {
          amountGo: 5000,
          amountReturn: 1000,
          driveChange: 500,
        },
      });

      // Assert
      expect(result.isRight()).toBe(true);
    });
  });

  describe('Error Scenarios - Transaction Not Found', () => {
    it('should rollback and return error when transaction not found', async () => {
      // Arrange
      const error = new AppException('Transaction not found', 404);
      mockTransactionRepository.findOne.mockResolvedValue(left(error));

      // Act
      const result = await service.execute({
        id: 'tx-invalid-999',
      });

      // Assert
      expect(mockUnitOfWork.rollback).toHaveBeenCalledTimes(1);
      expect(mockUnitOfWork.commit).not.toHaveBeenCalled();
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBe(error);
    });
  });

  describe('Error Scenarios - Category Validation', () => {
    it('should rollback and return error when category not found', async () => {
      // Arrange
      const transaction = TransactionEntity.create(
        VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
      );
      const categoryError = new AppException('Category not found', 404);
      mockTransactionRepository.findOne.mockResolvedValue(right(transaction));
      mockCategoryRepository.findOneById.mockResolvedValue(left(categoryError));

      // Act
      const result = await service.execute({
        id: transaction.id,
        categoryId: 'cat-invalid',
      });

      // Assert
      expect(mockUnitOfWork.rollback).toHaveBeenCalledTimes(1);
      expect(mockUnitOfWork.commit).not.toHaveBeenCalled();
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBe(categoryError);
    });

    it('should rollback and return error when category validation returns exception', async () => {
      // Arrange
      const transaction = TransactionEntity.create(
        VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
      );
      const repositoryError = new AppException(
        'Category repository error',
        500,
      );
      mockTransactionRepository.findOne.mockResolvedValue(right(transaction));
      mockCategoryRepository.findOneById.mockResolvedValue(
        left(repositoryError),
      );

      // Act
      const result = await service.execute({
        id: transaction.id,
        categoryId: 'cat-error',
      });

      // Assert
      expect(mockUnitOfWork.rollback).toHaveBeenCalled();
      expect(result.isLeft()).toBe(true);
    });
  });

  describe('Error Scenarios - Payment Method Validation', () => {
    it('should rollback and return error when payment method not found', async () => {
      // Arrange
      const transaction = TransactionEntity.create(
        VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
      );
      const paymentError = new AppException('Payment method not found', 404);
      mockTransactionRepository.findOne.mockResolvedValue(right(transaction));
      mockPaymentMethodRepository.findOneById.mockResolvedValue(
        left(paymentError),
      );

      // Act
      const result = await service.execute({
        id: transaction.id,
        paymentMethodId: 'pm-invalid',
      });

      // Assert
      expect(mockUnitOfWork.rollback).toHaveBeenCalledTimes(1);
      expect(mockUnitOfWork.commit).not.toHaveBeenCalled();
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBe(paymentError);
    });

    it('should rollback and return error when payment method validation fails', async () => {
      // Arrange
      const transaction = TransactionEntity.create(
        VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
      );
      const repositoryError = new AppException(
        'Payment method repository error',
        500,
      );
      mockTransactionRepository.findOne.mockResolvedValue(right(transaction));
      mockPaymentMethodRepository.findOneById.mockResolvedValue(
        left(repositoryError),
      );

      // Act
      const result = await service.execute({
        id: transaction.id,
        paymentMethodId: 'pm-error',
      });

      // Assert
      expect(mockUnitOfWork.rollback).toHaveBeenCalled();
      expect(result.isLeft()).toBe(true);
    });
  });

  describe('Error Scenarios - Save Operation', () => {
    it('should rollback and return error when save fails', async () => {
      // Arrange
      const transaction = TransactionEntity.create(
        VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
      );
      const saveError = new AppException('Failed to save transaction', 500);
      mockTransactionRepository.findOne.mockResolvedValue(right(transaction));
      mockTransactionRepository.save.mockResolvedValue(left(saveError));

      // Act
      const result = await service.execute({
        id: transaction.id,
        description: 'Update that will fail to save',
        amount: 10000,
      });

      // Assert
      expect(mockUnitOfWork.rollback).toHaveBeenCalledTimes(1);
      expect(mockUnitOfWork.commit).not.toHaveBeenCalled();
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBe(saveError);
    });

    it('should rollback when repository throws unexpected error', async () => {
      // Arrange
      const transaction = TransactionEntity.create(
        VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
      );
      mockTransactionRepository.findOne.mockResolvedValue(right(transaction));
      mockTransactionRepository.save.mockRejectedValue(
        new Error('Database connection error'),
      );

      // Act
      const result = await service.execute({
        id: transaction.id,
        description: 'Will cause error',
        amount: 10000,
      });

      // Assert
      expect(mockUnitOfWork.rollback).toHaveBeenCalled();
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppException);
    });
  });

  describe('Error Scenarios - Unexpected Exceptions', () => {
    it('should handle and return ServiceException for unexpected runtime error', async () => {
      // Arrange
      const transaction = TransactionEntity.create(
        VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
      );
      const unexpectedError = new Error('Unexpected runtime error');
      mockTransactionRepository.findOne.mockResolvedValue(right(transaction));
      mockTransactionRepository.save.mockRejectedValue(unexpectedError);

      // Act
      const result = await service.execute({
        id: transaction.id,
        description: 'Unexpected error',
        amount: 10000,
      });

      // Assert
      expect(mockUnitOfWork.rollback).toHaveBeenCalled();
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppException);
    });

    it('should handle AppException thrown during execution', async () => {
      // Arrange
      mockUnitOfWork.start.mockImplementation(() => {
        throw new AppException('Unit of Work error', 500);
      });

      // Act
      const result = await service.execute({
        id: 'tx-123',
        description: 'This will cause error at start',
      });

      // Assert
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppException);
    });
  });

  describe('Transaction Management - Unit of Work Lifecycle', () => {
    it('should call start before any operations', async () => {
      // Arrange
      const transaction = TransactionEntity.create(
        VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
      );
      mockTransactionRepository.findOne.mockResolvedValue(right(transaction));
      mockTransactionRepository.save.mockResolvedValue(right(transaction));

      // Act
      await service.execute({
        id: transaction.id,
        amount: 10000,
      });

      // Assert
      expect(mockUnitOfWork.start).toHaveBeenCalledTimes(1);
      // Verify start was called first by checking call order
      const startCallOrder = mockUnitOfWork.start.mock.invocationCallOrder[0];
      const findOneCallOrder =
        mockTransactionRepository.findOne.mock.invocationCallOrder[0];
      expect(startCallOrder).toBeLessThan(findOneCallOrder);
    });

    it('should call commit after successful save', async () => {
      // Arrange
      const transaction = TransactionEntity.create(
        VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
      );
      mockTransactionRepository.findOne.mockResolvedValue(right(transaction));
      mockTransactionRepository.save.mockResolvedValue(right(transaction));

      // Act
      const result = await service.execute({
        id: transaction.id,
        amount: 10000,
      });

      // Assert
      expect(result.isRight()).toBe(true);
      expect(mockUnitOfWork.commit).toHaveBeenCalledTimes(1);
      expect(mockUnitOfWork.rollback).not.toHaveBeenCalled();
    });

    it('should call rollback when transaction find fails', async () => {
      // Arrange
      const error = new AppException('Find failed', 500);
      mockTransactionRepository.findOne.mockResolvedValue(left(error));

      // Act
      await service.execute({ id: 'tx-123' });

      // Assert
      expect(mockUnitOfWork.rollback).toHaveBeenCalledTimes(1);
      expect(mockUnitOfWork.commit).not.toHaveBeenCalled();
    });

    it('should call rollback when category validation fails', async () => {
      // Arrange
      const transaction = TransactionEntity.create(
        VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
      );
      const categoryError = new AppException('Category validation failed', 404);
      mockTransactionRepository.findOne.mockResolvedValue(right(transaction));
      mockCategoryRepository.findOneById.mockResolvedValue(left(categoryError));

      // Act
      await service.execute({ id: transaction.id, categoryId: 'cat-invalid' });

      // Assert
      expect(mockUnitOfWork.rollback).toHaveBeenCalledTimes(1);
    });

    it('should call rollback when payment method validation fails', async () => {
      // Arrange
      const transaction = TransactionEntity.create(
        VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
      );
      const paymentError = new AppException(
        'Payment method validation failed',
        404,
      );
      mockTransactionRepository.findOne.mockResolvedValue(right(transaction));
      mockPaymentMethodRepository.findOneById.mockResolvedValue(
        left(paymentError),
      );

      // Act
      await service.execute({
        id: transaction.id,
        paymentMethodId: 'pm-invalid',
      });

      // Assert
      expect(mockUnitOfWork.rollback).toHaveBeenCalledTimes(1);
    });

    it('should call rollback when save fails', async () => {
      // Arrange
      const transaction = TransactionEntity.create(
        VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
      );
      const saveError = new AppException('Save failed', 500);
      mockTransactionRepository.findOne.mockResolvedValue(right(transaction));
      mockTransactionRepository.save.mockResolvedValue(left(saveError));

      // Act
      await service.execute({ id: transaction.id });

      // Assert
      expect(mockUnitOfWork.rollback).toHaveBeenCalledTimes(1);
    });

    it('should get transaction repository from unit of work', async () => {
      // Arrange
      const transaction = TransactionEntity.create(
        VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
      );
      mockTransactionRepository.findOne.mockResolvedValue(right(transaction));
      mockTransactionRepository.save.mockResolvedValue(right(transaction));

      // Act
      await service.execute({
        id: transaction.id,
        amount: 10000,
      });

      // Assert
      expect(mockUnitOfWork.getTransactionRepository).toHaveBeenCalled();
    });
  });

  describe('Edge Cases - CreatedAt Parameter', () => {
    it('should update transaction with createdAt parameter', async () => {
      // Arrange
      const transaction = TransactionEntity.create(
        VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
      );
      const newDate = new Date('2025-01-15');
      const updatedTransaction = TransactionEntity.create({
        ...VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
        id: transaction.id,
        createdAt: newDate,
      });

      mockTransactionRepository.findOne.mockResolvedValue(right(transaction));
      mockTransactionRepository.save.mockResolvedValue(
        right(updatedTransaction),
      );

      // Act
      const result = await service.execute({
        id: transaction.id,
        createdAt: newDate,
        amount: 10000,
      });

      // Assert
      expect(result.isRight()).toBe(true);
    });
  });

  describe('Response Validation', () => {
    it('should return UpdateTransactionResponse with updated transaction', async () => {
      // Arrange
      const transaction = TransactionEntity.create(
        VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
      );
      const updatedTransaction = TransactionEntity.create({
        ...VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
        id: transaction.id,
        description: 'Updated',
      });

      mockTransactionRepository.findOne.mockResolvedValue(right(transaction));
      mockTransactionRepository.save.mockResolvedValue(
        right(updatedTransaction),
      );

      // Act
      const result = await service.execute({
        id: transaction.id,
        description: 'Updated',
        amount: 10000,
      });

      // Assert
      expect(result.isRight()).toBe(true);
      if (result.isRight()) {
        const response = result.value;
        expect(response.transaction).toBeDefined();
        expect(response.fromResponse).toBeDefined();
      }
    });

    it('should return error as left when save fails', async () => {
      // Arrange
      const transaction = TransactionEntity.create(
        VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
      );
      const saveError = new AppException('Save error', 500);
      mockTransactionRepository.findOne.mockResolvedValue(right(transaction));
      mockTransactionRepository.save.mockResolvedValue(left(saveError));

      // Act
      const result = await service.execute({ id: transaction.id });

      // Assert
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppException);
    });
  });
});
