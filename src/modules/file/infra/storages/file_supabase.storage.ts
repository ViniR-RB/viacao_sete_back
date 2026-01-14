import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import ConfigurationService from '@/core/services/configuration.service';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import Unit from '@/core/types/unit';
import IFileStorage from '@/modules/file/adapters/i.file.storage';
import FileEntity from '@/modules/file/domain/entities/file.entity';
import FileStorageException from '@/modules/file/exceptions/file_storage.exception';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export default class FileSupabaseStorage implements IFileStorage {
  private readonly supabase: SupabaseClient<any, 'public', any>;
  constructor(private readonly configurationService: ConfigurationService) {
    const supabaseUrl = this.configurationService.get('SUPABASE_URL');
    const supabaseApiKey = this.configurationService.get('SUPABASE_API_KEY');
    this.supabase = createClient(supabaseUrl, supabaseApiKey);
  }
  getFileUrl(fileName: string): AsyncResult<AppException, string> {
    throw new Error('Method not implemented.');
  }
  async store(file: FileEntity): AsyncResult<AppException, Unit> {
    try {
      const bucketName = this.configurationService.get(
        'SUPABASE_STORAGE_BUCKET',
      );
      const { data: dataUpload, error } = await this.supabase.storage
        .from(bucketName)
        .upload(file.filename, file.buffer, { upsert: true, contentType: file.mimetype });
      if (error) {
        console.error(error);
        return left(
          new FileStorageException(ErrorMessages.UNEXPECTED_ERROR, 500, error),
        );
      }

      return right(dataUpload.path);
    } catch (error) {
      console.error(error);
      return left(
        new FileStorageException(ErrorMessages.UNEXPECTED_ERROR, 500),
      );
    }
  }
  delete(fileName: string): AsyncResult<AppException, Unit> {
    throw new Error('Method not implemented.');
  }
}
