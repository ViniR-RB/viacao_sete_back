import { AttachmentScope } from '@/modules/attachments/domain/types/attachment-scope';
import AttachmentDto from '@/modules/attachments/dto/attachment.dto';
import { PickType } from '@nestjs/swagger';
import { IsEnum, IsString, IsUUID, Length } from 'class-validator';

export default class CreateAttachmentDto extends PickType(AttachmentDto, [
  'name',
  'scope',
  'entityId',
]) {
  @IsString()
  @Length(3, 255)
  declare name: string;

  @IsEnum(AttachmentScope)
  declare scope: AttachmentScope;

  @IsUUID() declare entityId: string;
}
