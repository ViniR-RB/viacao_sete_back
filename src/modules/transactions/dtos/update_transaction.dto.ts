import { CreateTransactionDto } from '@/modules/transactions/dtos/create_transaction.dto';
import { OmitType, PartialType } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export default class UpdateTransactionDto extends PartialType(
  OmitType(CreateTransactionDto, ['createdAt']),
) {
  @IsOptional()
  @IsDateString()
  createdAt?: Date;
}
