import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import ServiceException from '@/core/exceptions/service.exception';
import IUnitOfWork from '@/core/interface/i_unit_of_work';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import IAttachmentRepository from '@/modules/attachments/adapters/i_attachment.repository';
import AttachmentEntity from '@/modules/attachments/domain/entities/attachment.entity';
import ICreateAttachmentUseCase, {
  CreateAttachmentParam,
  CreateAttachmentResponse,
} from '@/modules/attachments/domain/usecase/i_create_attachment_use_case';
import IUploadFileUseCase from '@/modules/file/domain/usecase/i_upload_file_use.case';

export default class CreateAttachmentService
  implements ICreateAttachmentUseCase
{
  constructor(
    private readonly uploadFileService: IUploadFileUseCase,
    private readonly unitOfWork: IUnitOfWork,
  ) {}

  async execute(
    param: CreateAttachmentParam,
  ): AsyncResult<AppException, CreateAttachmentResponse> {
    try {
      const fileId = crypto.randomUUID();

      const attachmentEntity = AttachmentEntity.create({
        name: param.name,
        fileUrl: fileId,
        scope: param.scope,
        entityId: param.entityId,
      });

      await this.unitOfWork.start();

      const attachmentRepository: IAttachmentRepository =
        this.unitOfWork.getAttachmentRepository();

      const saveResult = await attachmentRepository.save(attachmentEntity);

      if (saveResult.isLeft()) {
        await this.unitOfWork.rollback();
        return left(saveResult.value);
      }

      const uploadResult = await this.uploadFileService.execute({
        ...param.file,
        id: fileId,
      });

      if (uploadResult.isLeft()) {
        await this.unitOfWork.rollback();
        return left(uploadResult.value);
      }

      await this.unitOfWork.commit();

      return right(new CreateAttachmentResponse(saveResult.value.id));
    } catch (error) {
      await this.unitOfWork.rollback();
      if (error instanceof AppException) {
        return left(error);
      }
      return left(
        new ServiceException(ErrorMessages.UNEXPECTED_ERROR, 500, error),
      );
    }
  }
}
