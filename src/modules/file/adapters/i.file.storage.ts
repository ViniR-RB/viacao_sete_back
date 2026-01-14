import AppException from '@/core/exceptions/app_exception';
import AsyncResult from '@/core/types/async_result';
import Unit from '@/core/types/unit';
import FileEntity from '@/modules/file/domain/entities/file.entity';

export default interface IFileStorage {
  getFileUrl(fileName: string): AsyncResult<AppException, string>;
  store(file: FileEntity): AsyncResult<AppException, Unit>;
  delete(fileName: string): AsyncResult<AppException, Unit>;
}
