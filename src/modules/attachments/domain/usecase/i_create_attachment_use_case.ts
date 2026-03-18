import { TransactionContextType } from '@/core/interface/transaction_context_type';
import UseCase from '@/core/interface/use_case';
import AttachmentEntity from '@/modules/attachments/domain/entities/attachment.entity';
import { AttachmentScope } from '@/modules/attachments/domain/types/attachment-scope';
import BaseFileInterface from '@/modules/file/domain/types/base_file_interface';

export interface CreateAttachmentParam {
  file: BaseFileInterface;
  name: string;
  scope: AttachmentScope;
  entityId: string;
  context?: TransactionContextType;
}

export class CreateAttachmentResponse {
  constructor(readonly attachment: AttachmentEntity) {}
}

export default interface ICreateAttachmentUseCase
  extends UseCase<CreateAttachmentParam, CreateAttachmentResponse> {}
