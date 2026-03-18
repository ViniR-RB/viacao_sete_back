import AppException from '@/core/exceptions/app_exception';

export default class ReportRepositoryException extends AppException {
  constructor(message: string, statusCode: number = 400, cause?: Error) {
    super(message, statusCode, cause);
  }

  static notFound(id?: string) {
    const message = id
      ? `Report with id ${id} not found.`
      : 'Report not found.';
    return new ReportRepositoryException(message, 404);
  }
}
