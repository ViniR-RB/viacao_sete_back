import UseCase from '@/core/interface/use_case';
import BaseFileInterface from '@/modules/file/domain/types/base_file_interface';

export type UploadFileParam = BaseFileInterface & {
  id?: string;
};

export class UploadFileResponse {
  constructor(public readonly fileName: string) {}

  fromResponse() {
    return { fileName: this.fileName };
  }
}

export default interface IUploadFileUseCase
  extends UseCase<UploadFileParam, UploadFileResponse> {}
