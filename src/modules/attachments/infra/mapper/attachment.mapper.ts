import AttachmentEntity from '@/modules/attachments/domain/entities/attachment.entity';
import AttachmentModel from '@/modules/attachments/infra/models/attachment.model';

export default class AttachmentMapper {
  static toModel(entity: AttachmentEntity): AttachmentModel {
    const model = new AttachmentModel();
    model.id = entity.id;
    model.name = entity.name;
    model.fileUrl = entity.fileUrl;
    model.scope = entity.scope;
    model.entityId = entity.entityId;
    return model;
  }

  static toEntity(model: AttachmentModel): AttachmentEntity {
    return AttachmentEntity.fromData({
      id: model.id,
      name: model.name,
      fileUrl: model.fileUrl,
      scope: model.scope,
      entityId: model.entityId,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toReadModel(model: AttachmentModel) {
    return {
      id: model.id,
      name: model.name,
      fileUrl: model.fileUrl,
      scope: model.scope,
      entityId: model.entityId,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }
}
