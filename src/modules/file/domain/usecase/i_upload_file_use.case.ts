import UseCase from '@/core/interface/use_case';
import BaseFileInterface from '@/modules/file/domain/types/base_file_interface';

export type UploadFileParam = BaseFileInterface & {
  id?: string;
};

export class UploadFileResponse {
  constructor(public readonly fileId: string) {}

  fromResponse() {
    return { fileId: this.fileId };
  }
}

export default interface IUploadFileUseCase
  extends UseCase<UploadFileParam, UploadFileResponse> {}
