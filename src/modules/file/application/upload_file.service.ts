import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import ServiceException from '@/core/exceptions/service.exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import IFileStorage from '@/modules/file/adapters/i.file.storage';
import FileEntity from '@/modules/file/domain/entities/file.entity';
import IUploadFileUseCase, {
  UploadFileParam,
  UploadFileResponse,
} from '@/modules/file/domain/usecase/i_upload_file_use.case';

export default class UploadFileService implements IUploadFileUseCase {
  constructor(private readonly fileStorage: IFileStorage) {}
  async execute(
    param: UploadFileParam,
  ): AsyncResult<AppException, UploadFileResponse> {
    try {
      const fileEntity = FileEntity.create({
        id: param.id,
        buffer: param.buffer,
        originalName: param.originalName,
        mimetype: param.mimetype,
        size: param.size,
        filename: param.originalName,
        encoding: param.encoding,
      });

      fileEntity.changeFileNameForId();

      const uploadFileResult = await this.fileStorage.store(fileEntity);

      if (uploadFileResult.isLeft()) {
        return left(uploadFileResult.value);
      }

      return right(new UploadFileResponse(fileEntity.filename));
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
