import AppException from '@/core/exceptions/app_exception';

export default class TransactionCategoryRespositoryException extends AppException {
  constructor(message: string, statusCode: number = 400, cause?: Error) {
    super(message, statusCode, cause);
  }

  static notFound(id?: string) {
    const message = id
      ? `Transaction category with ID ${id} not found.`
      : 'Transaction category not found.';
    return new TransactionCategoryRespositoryException(message, 404);
  }
}
