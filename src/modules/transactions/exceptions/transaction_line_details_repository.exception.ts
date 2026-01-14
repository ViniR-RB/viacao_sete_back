import AppException from '@/core/exceptions/app_exception';

export default class TransactionLineDetailsRepositoryException extends AppException {
  constructor(message: string, statusCode: number = 400, cause?: Error) {
    super(message, statusCode, cause);
  }

  static notFound(id?: string) {
    const message = id
      ? `TransactionLineDetails with id ${id} not found.`
      : 'TransactionLineDetails not found.';
    return new TransactionLineDetailsRepositoryException(message, 404);
  }
}
