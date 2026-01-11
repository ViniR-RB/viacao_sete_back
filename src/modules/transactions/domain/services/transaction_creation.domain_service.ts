import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import ServiceException from '@/core/exceptions/service.exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import { Amount } from '@/core/value-objects/amount';
import ITransactionLineDetailsRepository from '@/modules/transactions/adapters/i_transaction_line_details.repository';
import TransactionLineDetailsEntity from '@/modules/transactions/domain/entities/transaction_line_details.entity';
import { randomUUID } from 'crypto';

export interface TransactionLineDetailsInput {
  amountGo: number;
  amountReturn: number;
  driveChange: number;
}

/**
 * Domain Service responsável pela lógica de criação e processamento de transações
 * Encapsula regras de negócio complexas do domínio
 */
export default class TransactionCreationDomainService {
  constructor(
    private readonly transactionLineDetailsRepository: ITransactionLineDetailsRepository,
  ) {}

  /**
   * Processa os detalhes da linha de transação se fornecidos
   * Retorna o montante total e o ID da linha de detalhes, ou null se não houver detalhes
   */
  async processLineDetails(
    lineDetailsInput: TransactionLineDetailsInput | null,
    transactionId: string,
  ): AsyncResult<
    AppException,
    { amount: Amount; lineDetailsId: string | null }
  > {
    if (!lineDetailsInput) {
      return right({
        amount: Amount.fromCents(0),
        lineDetailsId: null,
      });
    }

    const lineDetailsId = randomUUID();

    try {
      const transactionLineDetails = TransactionLineDetailsEntity.create({
        id: lineDetailsId,
        transactionId,
        amountGo: Amount.fromReais(lineDetailsInput.amountGo),
        amountReturn: Amount.fromReais(lineDetailsInput.amountReturn),
        driveChange: Amount.fromReais(lineDetailsInput.driveChange),
      });

      const saveResult = await this.transactionLineDetailsRepository.save(
        transactionLineDetails,
      );

      if (saveResult.isLeft()) {
        return left(saveResult.value);
      }

      return right({
        amount: transactionLineDetails.getTotalAmount(),
        lineDetailsId,
      });
    } catch (error) {
      if (error instanceof AppException) {
        return left(error);
      }
      return left(
        new ServiceException(ErrorMessages.UNEXPECTED_ERROR, 500, error),
      );
    }
  }
}
