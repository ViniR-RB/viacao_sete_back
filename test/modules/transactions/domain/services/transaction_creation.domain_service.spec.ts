import TransactionCreationDomainService from '@/modules/transactions/domain/services/transaction_creation.domain_service';
import { TransactionLineDetailsRepositoryMock } from '@test/constants/mocks/transaction_line_details.repository.mock';

describe('TransactionCreationDomainService', () => {
  let service: TransactionCreationDomainService;
  let transactionLineDetailsRepository: TransactionLineDetailsRepositoryMock;

  beforeEach(() => {
    transactionLineDetailsRepository =
      new TransactionLineDetailsRepositoryMock();
    service = new TransactionCreationDomainService(
      transactionLineDetailsRepository,
    );
  });

  it('should process line details and return amount and lineDetailsId on success', async () => {
    const mockInput = {
      amountGo: 1000,
      amountReturn: 2000,
      driveChange: 500,
    };
    const mockTransactionId = 'test-transaction-id';
    // Mock save to return a right (success) result
    transactionLineDetailsRepository.save.mockResolvedValue({
      isLeft: () => false,
      isRight: () => true,
      value: undefined,
    });

    const result = await service.processLineDetails(
      mockInput,
      mockTransactionId,
    );

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.amount.getValue).toBeGreaterThan(0);
      expect(typeof result.value.lineDetailsId).toBe('string');
    }
    expect(transactionLineDetailsRepository.save).toHaveBeenCalled();
  });

  it('should return amount 0 and lineDetailsId null if lineDetailsInput is null', async () => {
    const mockTransactionId = 'test-transaction-id';
    const result = await service.processLineDetails(null, mockTransactionId);

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.amount.getValue).toBe(0);
      expect(result.value.lineDetailsId).toBeNull();
    }
    expect(transactionLineDetailsRepository.save).not.toHaveBeenCalled();
  });

  it('should return left if repository save returns left (error)', async () => {
    const mockInput = {
      amountGo: 1000,
      amountReturn: 2000,
      driveChange: 500,
    };
    const mockTransactionId = 'test-transaction-id';
    const mockError = new Error('Repository error');
    transactionLineDetailsRepository.save.mockResolvedValue({
      isLeft: () => true,
      isRight: () => false,
      value: mockError,
    });

    const result = await service.processLineDetails(
      mockInput,
      mockTransactionId,
    );

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBe(mockError);
    }
    expect(transactionLineDetailsRepository.save).toHaveBeenCalled();
  });
});
