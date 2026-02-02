import AppException from '@/core/exceptions/app_exception';

export default class PaymentMethodDomainException extends AppException {
  constructor(message: string, statusCode = 400) {
    super(message, statusCode);
    this.name = 'PaymentMethodDomainException';
  }
}
