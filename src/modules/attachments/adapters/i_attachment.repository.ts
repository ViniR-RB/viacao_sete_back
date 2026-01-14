import AppException from '@/core/exceptions/app_exception';
import BaseRepository from '@/core/interface/base.repository';
import AsyncResult from '@/core/types/async_result';
import Unit from '@/core/types/unit';
import AttachmentEntity from '@/modules/attachments/domain/entities/attachment.entity';
import AttachmentModel from '@/modules/attachments/infra/models/attachment.model';

export interface AttachmentQueryOptions {
  selectFields?: (keyof AttachmentModel)[];
  relations?: string[];
  id?: string;
  entityId?: string;
  scope?: string;
}

export default interface IAttachmentRepository
  extends BaseRepository<AttachmentEntity, AttachmentModel> {
  findOne(
    query: AttachmentQueryOptions,
  ): AsyncResult<AppException, AttachmentEntity>;
  findByEntityId(
    entityId: string,
  ): AsyncResult<AppException, AttachmentEntity[]>;
  delete(id: string): AsyncResult<AppException, Unit>;
}
