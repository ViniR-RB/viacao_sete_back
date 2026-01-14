import BaseFileInterface from '@/modules/file/domain/types/base_file_interface';
import FileDomainException from '@/modules/file/exceptions/file_domain.exception';
import { randomUUID } from 'crypto';

interface FileEntityProps extends BaseFileInterface {
  id: string;
  filename: string;
}

export default class FileEntity {
  private constructor(private readonly props: FileEntityProps) {
    this.props = {
      id: props.id,
      originalName: props.originalName,
      filename: props.filename,
      buffer: props.buffer,
      size: props.size,
      mimetype: props.mimetype,
      encoding: props.encoding,
    };
  }

  static create(props: Omit<FileEntityProps, 'id'> & { id?: string }) {
    FileEntity.validate(props);
    const file = new FileEntity({
      ...props,
      id: props.id ?? randomUUID(),
    });
    return file;
  }

  static validate(props: Partial<FileEntityProps>) {
    if (props.originalName && props.originalName.length < 3) {
      throw new FileDomainException('Original name is required');
    }
    if (props.filename && props.filename.length < 3) {
      throw new FileDomainException('Filename is required');
    }

    if (props.size !== undefined && props.size <= 0) {
      throw new FileDomainException('File size must be greater than zero');
    }
    if (props.mimetype && props.mimetype.length < 3) {
      throw new FileDomainException('Mimetype is required');
    }
    if (props.buffer !== undefined && props.buffer.length === 0) {
      throw new FileDomainException('File buffer is required');
    }
  }

  changeFileNameForId() {
    const fileExtension = this.filename.split('.').pop();
    this.props.filename = `${this.id}.${fileExtension}`;
  }

  get id() {
    return this.props.id!;
  }

  get originalName() {
    return this.props.originalName;
  }

  get filename() {
    return this.props.filename;
  }

  get size() {
    return this.props.size;
  }

  get mimetype() {
    return this.props.mimetype;
  }

  get encoding() {
    return this.props.encoding;
  }
  get buffer() {
    return this.props.buffer;
  }

  toObject() {
    return {
      id: this.id,
      originalName: this.originalName,
      filename: this.filename,
      buffer: this.buffer,
      size: this.size,
      mimetype: this.mimetype,
      encoding: this.encoding,
    };
  }
}
