import { AttachmentScope } from '@/modules/attachments/domain/types/attachment-scope';
import AttachmentDomainException from '@/modules/attachments/exceptions/attachment_domain.exception';

export interface AttachmentEntityProps {
  id: string;
  name: string;
  fileUrl: string;
  scope: AttachmentScope;
  entityId: string;
  createdAt: Date;
  updatedAt: Date;
}

export default class AttachmentEntity {
  private constructor(private readonly props: AttachmentEntityProps) {}

  static create(
    props: Omit<AttachmentEntityProps, 'id' | 'createdAt' | 'updatedAt'> & {
      id?: string;
    },
  ) {
    this.validate(props);

    return new AttachmentEntity({
      ...props,
      id: props.id || crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static fromData(props: AttachmentEntityProps) {
    return new AttachmentEntity(props);
  }

  private static validate(
    props: Omit<AttachmentEntityProps, 'id' | 'createdAt' | 'updatedAt'>,
  ) {
    if (!props.name || props.name.trim().length === 0) {
      throw new AttachmentDomainException('Name is required');
    }

    if (!props.fileUrl || props.fileUrl.trim().length === 0) {
      throw new AttachmentDomainException('File URL is required');
    }

    if (!Object.values(AttachmentScope).includes(props.scope)) {
      throw new AttachmentDomainException('Invalid attachment scope');
    }

    if (!props.entityId || props.entityId.trim().length === 0) {
      throw new AttachmentDomainException('Entity ID is required');
    }
  }

  get id() {
    return this.props.id;
  }

  get name() {
    return this.props.name;
  }

  get fileUrl() {
    return this.props.fileUrl;
  }

  get scope() {
    return this.props.scope;
  }

  get entityId() {
    return this.props.entityId;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  toObject() {
    return {
      id: this.props.id,
      name: this.props.name,
      fileUrl: this.props.fileUrl,
      scope: this.props.scope,
      entityId: this.props.entityId,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }
}
