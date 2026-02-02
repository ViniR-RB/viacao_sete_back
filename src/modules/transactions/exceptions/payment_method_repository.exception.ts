import AppException from '@/core/exceptions/app_exception';

export class PaymentMethodRepositoryException extends AppException {
  constructor(message: string, statusCode: number = 400, error?: Error) {
    super(message, statusCode, error);
    this.name = 'PaymentMethodRepositoryException';
  }

  static notFound(id?: string) {
    return new PaymentMethodRepositoryException(
      id
        ? `Payment method with id ${id} not found`
        : 'Payment method not found',
      404,
    );
  }
}
