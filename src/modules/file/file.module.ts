import CoreModule from '@/core/core_module';
import ConfigurationService from '@/core/services/configuration.service';
import IFileStorage from '@/modules/file/adapters/i.file.storage';
import UploadFileService from '@/modules/file/application/upload_file.service';
import FileLocalStorage from '@/modules/file/infra/storages/file_local.storage';
import { FILE_STORAGE, UPLOAD_FILE_SERIVICE } from '@/modules/file/symbols';
import { Module } from '@nestjs/common';

@Module({
  imports: [CoreModule],
  providers: [
    {
      inject: [ConfigurationService],
      provide: FILE_STORAGE,
      useFactory: (configurationService: ConfigurationService) => {
        const nodeEnv = configurationService.get('NODE_ENV');
        if (nodeEnv !== 'dev') {
          return new FileLocalStorage(configurationService);
        }
        return new FileLocalStorage(configurationService);
      },
    },
    {
      inject: [FILE_STORAGE],
      provide: UPLOAD_FILE_SERIVICE,
      useFactory: (fileStorage: IFileStorage) => {
        return new UploadFileService(fileStorage);
      },
    },
  ],
  exports: [UPLOAD_FILE_SERIVICE],
})
export default class FileModule {
  constructor() {}
}
