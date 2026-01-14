import AppException from '@/core/exceptions/app_exception';

export default class AttachmentRepositoryException extends AppException {
  constructor(message: string, status: number = 500, originalError?: Error) {
    super(message, status, originalError);
  }

  static notFound(id?: string): AttachmentRepositoryException {
    const message = id
      ? `Attachment with id ${id} not found`
      : 'Attachment not found';
    return new AttachmentRepositoryException(message, 404);
  }
}
