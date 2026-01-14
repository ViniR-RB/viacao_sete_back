import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import ServiceException from '@/core/exceptions/service.exception';
import IUnitOfWork from '@/core/interface/i_unit_of_work';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import Unit, { unit } from '@/core/types/unit';
import IAttachmentRepository from '@/modules/attachments/adapters/i_attachment.repository';
import AttachmentEntity from '@/modules/attachments/domain/entities/attachment.entity';
import { AttachmentScope } from '@/modules/attachments/domain/types/attachment-scope';
import ICreateAttachmentUseCase, {
  CreateAttachmentParam,
  CreateAttachmentResponse,
} from '@/modules/attachments/domain/usecase/i_create_attachment_use_case';
import IUploadFileUseCase from '@/modules/file/domain/usecase/i_upload_file_use.case';
import ITransactionRepository from '@/modules/transactions/adapters/i_transaction.repository';

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
      await this.unitOfWork.start();

      const attachmentId = crypto.randomUUID();

      // Validar se a entidade existe baseado no scope
      const entityValidationResult =
        await this.validateEntityExistsAndUpdateAttachment(
          param.entityId,
          param.scope,
          attachmentId,
        );

      if (entityValidationResult.isLeft()) {
        await this.unitOfWork.rollback();
        return left(entityValidationResult.value);
      }

      const fileId = crypto.randomUUID();

      const attachmentEntity = AttachmentEntity.create({
        id: attachmentId,
        name: param.name,
        fileUrl: fileId,
        scope: param.scope,
        entityId: param.entityId,
      });

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

      return right(new CreateAttachmentResponse(attachmentId));
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

  private async validateEntityExistsAndUpdateAttachment(
    entityId: string,
    scope: AttachmentScope,
    attachmentId: string,
  ): AsyncResult<AppException, Unit> {
    switch (scope) {
      case AttachmentScope.TRANSACTION: {
        const transactionRepository: ITransactionRepository =
          this.unitOfWork.getTransactionRepository();

        const findResult = await transactionRepository.findOne({
          transactionId: entityId,
        });

        if (findResult.isLeft()) {
          return left(
            new ServiceException(
              'Transaction not found for the provided entity ID',
              404,
            ),
          );
        }
        findResult.value.addAttachment(attachmentId);

        const updateResult = await transactionRepository.save(findResult.value);

        if (updateResult.isLeft()) {
          throw updateResult.value;
        }
        return right(unit);
      }

      default:
        throw new ServiceException('Unknown attachment scope', 400);
    }
  }
}
