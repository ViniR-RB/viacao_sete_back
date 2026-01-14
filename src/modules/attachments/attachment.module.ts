import CoreModule from '@/core/core_module';
import IUnitOfWork from '@/core/interface/i_unit_of_work';
import { UNIT_OF_WORK } from '@/core/symbols';
import CreateAttachmentService from '@/modules/attachments/application/create_attachment.service';
import AttachmentsController from '@/modules/attachments/controller/attachment.controller';
import AttachmentModel from '@/modules/attachments/infra/models/attachment.model';
import AttachmentRepository from '@/modules/attachments/infra/repositories/attachment.repository';
import {
  ATTACHMENT_REPOSITORY,
  CREATE_ATTACHMENT_SERVICE,
} from '@/modules/attachments/symbols';
import IUploadFileUseCase from '@/modules/file/domain/usecase/i_upload_file_use.case';
import FileModule from '@/modules/file/file.module';
import { UPLOAD_FILE_SERIVICE } from '@/modules/file/symbols';
import { Module } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Module({
  controllers: [AttachmentsController],
  imports: [
    TypeOrmModule.forFeature([AttachmentModel]),
    CoreModule,
    FileModule,
  ],
  providers: [
    {
      inject: [getRepositoryToken(AttachmentModel)],
      provide: ATTACHMENT_REPOSITORY,
      useFactory: (attachmentRepository: Repository<AttachmentModel>) =>
        new AttachmentRepository(attachmentRepository),
    },
    {
      inject: [UPLOAD_FILE_SERIVICE, UNIT_OF_WORK],
      provide: CREATE_ATTACHMENT_SERVICE,
      useFactory: (
        uploadFileService: IUploadFileUseCase,
        unitOfWork: IUnitOfWork,
      ) => new CreateAttachmentService(uploadFileService, unitOfWork),
    },
  ],
  exports: [ATTACHMENT_REPOSITORY, CREATE_ATTACHMENT_SERVICE],
})
export default class AttachmentModule {}
