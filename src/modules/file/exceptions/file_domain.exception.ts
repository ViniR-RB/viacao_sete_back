import AppException from '@/core/exceptions/app_exception';

export default class FileDomainException extends AppException {
  constructor(message: string, statusCode: number = 400, error?: any) {
    super(message, statusCode, error);
  }
}
