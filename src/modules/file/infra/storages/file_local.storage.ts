import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import ConfigurationService from '@/core/services/configuration.service';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import Unit, { unit } from '@/core/types/unit';
import IFileStorage from '@/modules/file/adapters/i.file.storage';
import FileEntity from '@/modules/file/domain/entities/file.entity';
import FileStorageException from '@/modules/file/exceptions/file_storage.exception';

import * as fs from 'fs';
import * as path from 'path';

export default class FileLocalStorage implements IFileStorage {
  constructor(private readonly configurationService: ConfigurationService) {}

  getFileUrl(fileName: string): AsyncResult<AppException, string> {
    throw new FileStorageException('Method not implemented.');
  }

  async store(fileData: FileEntity): AsyncResult<AppException, Unit> {
    try {
      const filesDir = path.resolve(process.cwd(), 'files');

      if (!fs.existsSync(filesDir)) {
        await fs.promises.mkdir(filesDir, { recursive: true });
      }
      const filePath = path.resolve(filesDir, fileData.filename);

      await fs.promises.writeFile(filePath, fileData.buffer);

      return right(unit);
    } catch (e) {
      return left(
        new FileStorageException(ErrorMessages.UNEXPECTED_ERROR, 500, e),
      );
    }
  }
  async delete(fileName: string): AsyncResult<AppException, Unit> {
    try {
      const filesDir = path.resolve(process.cwd(), 'files');

      let actualFileName = fileName;
      if (fileName.includes('/')) {
        actualFileName = path.basename(fileName);
      }

      const filePath = path.resolve(filesDir, actualFileName);

      if (!fs.existsSync(filePath)) {
        return left(
          new FileStorageException(ErrorMessages.FILE_NOT_FOUND, 404),
        );
      }

      await fs.promises.unlink(filePath);

      return right(unit);
    } catch (e) {
      return left(
        new FileStorageException(ErrorMessages.UNEXPECTED_ERROR, 500, e),
      );
    }
  }
  async exists(fileName: string): AsyncResult<AppException, boolean> {
    try {
      const filesDir = path.resolve(process.cwd(), 'files');

      let actualFileName = fileName;
      if (fileName.includes('/')) {
        actualFileName = path.basename(fileName);
      }

      const filePath = path.resolve(filesDir, actualFileName);
      const fileExists = fs.existsSync(filePath);

      return right(fileExists);
    } catch (e) {
      return left(
        new FileStorageException(ErrorMessages.UNEXPECTED_ERROR, 500, e),
      );
    }
  }
  getFilePath(filename: string): string {
    const filesDir = path.resolve(process.cwd(), 'files');
    return path.resolve(filesDir, filename);
  }
  getFileStream(
    path: string,
  ): AsyncResult<AppException, NodeJS.ReadableStream> {
    throw new Error('Method not implemented.');
  }
}
