import UseCase from '@/core/interface/use_case';
import { AttachmentScope } from '@/modules/attachments/domain/types/attachment-scope';
import BaseFileInterface from '@/modules/file/domain/types/base_file_interface';

export interface CreateAttachmentParam {
  file: BaseFileInterface;
  name: string;
  scope: AttachmentScope;
  entityId: string;
}

export class CreateAttachmentResponse {
  constructor(readonly attachmentId: string) {}
}

export default interface ICreateAttachmentUseCase
  extends UseCase<CreateAttachmentParam, CreateAttachmentResponse> {}
