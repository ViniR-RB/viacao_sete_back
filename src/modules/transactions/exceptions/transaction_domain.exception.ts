import AppException from '@/core/exceptions/app_exception';

export default class TransactionDomainException extends AppException {
  constructor(message: string, statusCode: number = 400, cause?: Error) {
    super(message, statusCode, cause);
  }
}
