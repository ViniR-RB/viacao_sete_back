import { BaseModelPrimaryColumnUuid } from '@/core/interface/base_model';
import { AttachmentScope } from '@/modules/attachments/domain/types/attachment-scope';
import { Column, Entity, Index } from 'typeorm';

@Entity('attachments')
@Index(['scope', 'entityId'])
@Index(['scope'])
@Index(['entityId'])
export default class AttachmentModel extends BaseModelPrimaryColumnUuid {
  @Column('varchar', { length: 255 })
  name: string;

  @Column('varchar', { length: 500 })
  fileUrl: string;

  @Column('enum', { enum: AttachmentScope })
  scope: AttachmentScope;

  @Column('uuid')
  entityId: string;
}
