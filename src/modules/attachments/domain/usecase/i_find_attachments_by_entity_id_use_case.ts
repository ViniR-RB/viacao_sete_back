import UseCase from '@/core/interface/use_case';
import AttachmentEntity from '@/modules/attachments/domain/entities/attachment.entity';

export interface FindAttachmentsByEntityIdParam {
  entityId: string;
}

export class FindAttachmentsByEntityIdResponse {
  constructor(public readonly attachments: AttachmentEntity[]) {}

  fromResponse() {
    return this.attachments.map(attachment => attachment.toObject());
  }
}

export default interface IFindAttachmentsByEntityIdUseCase
  extends UseCase<
    FindAttachmentsByEntityIdParam,
    FindAttachmentsByEntityIdResponse
  > {}
