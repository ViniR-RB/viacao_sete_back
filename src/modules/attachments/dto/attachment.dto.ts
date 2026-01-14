import { AttachmentScope } from '@/modules/attachments/domain/types/attachment-scope';
import { ApiProperty } from '@nestjs/swagger';

export default class AttachmentDto {
  @ApiProperty({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Unique identifier for the attachment',
    examples: ['a3bb189e-8bf9-3888-9912-ace4e6543002'],
  })
  id: string;

  @ApiProperty({
    name: 'name',
    type: 'string',
    description: 'Name of the attachment',
    examples: ['Nfe June 2024.pdf', 'Photo.png'],
  })
  name: string;

  @ApiProperty({
    name: 'fileUrl',
    type: 'string',
    description: 'URL of the attachment file',
    examples: ['https://example.com/path/to/file.jpg'],
  })
  fileUrl: string;

  @ApiProperty({
    name: 'scope',
    type: 'string',
    description: 'Scope of the attachment',
    examples: Object.values(AttachmentScope),
  })
  scope: AttachmentScope;

  @ApiProperty({
    name: 'entityId',
    type: 'string',
    format: 'uuid',
    description: 'Identifier of the associated entity',
    examples: ['b4bb189e-8bf9-3888-9912-ace4e6543003'],
  })
  entityId: string;

  @ApiProperty({
    name: 'createdAt',
    type: 'string',
    format: 'date-time',
    description: 'Timestamp when the attachment was created',
    examples: ['2024-06-15T13:45:30Z'],
  })
  createdAt: Date;

  @ApiProperty({
    name: 'updatedAt',
    type: 'string',
    format: 'date-time',
    description: 'Timestamp when the attachment was last updated',
    examples: ['2024-06-15T13:45:30Z'],
  })
  updatedAt: Date;
}
