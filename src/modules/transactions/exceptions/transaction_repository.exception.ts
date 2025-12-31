import AppException from '@/core/exceptions/app_exception';

export default class TransactionRepositoryException extends AppException {
  constructor(message: string, statusCode: number = 400, cause?: Error) {
    super(message, statusCode, cause);
  }

  static notFound(id?: string) {
    const message = id
      ? `Transaction with id ${id} not found.`
      : 'Transaction not found.';
    return new TransactionRepositoryException(message, 404);
  }
}
