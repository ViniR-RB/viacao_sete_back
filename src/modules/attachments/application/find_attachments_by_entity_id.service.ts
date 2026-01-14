import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import ServiceException from '@/core/exceptions/service.exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import IAttachmentRepository from '@/modules/attachments/adapters/i_attachment.repository';
import IFindAttachmentsByEntityIdUseCase, {
  FindAttachmentsByEntityIdParam,
  FindAttachmentsByEntityIdResponse,
} from '@/modules/attachments/domain/usecase/i_find_attachments_by_entity_id_use_case';

export default class FindAttachmentsByEntityIdService
  implements IFindAttachmentsByEntityIdUseCase
{
  constructor(private readonly attachmentRepository: IAttachmentRepository) {}

  async execute(
    param: FindAttachmentsByEntityIdParam,
  ): AsyncResult<AppException, FindAttachmentsByEntityIdResponse> {
    try {
      const result = await this.attachmentRepository.findByEntityId(
        param.entityId,
      );

      if (result.isLeft()) {
        return left(result.value);
      }

      return right(new FindAttachmentsByEntityIdResponse(result.value));
    } catch (error) {
      return left(
        new ServiceException(ErrorMessages.UNEXPECTED_ERROR, 500, error),
      );
    }
  }
}
