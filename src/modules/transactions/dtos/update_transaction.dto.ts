import { CreateTransactionDto } from '@/modules/transactions/dtos/create_transaction.dto';
import UpdateSplitPaymentDto from '@/modules/transactions/dtos/update_split_payment.dto';
import { OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsObject, IsOptional } from 'class-validator';

export default class UpdateTransactionDto extends PartialType(
  OmitType(CreateTransactionDto, ['createdAt', 'splitPayments']),
) {
  @IsOptional()
  @IsDateString()
  createdAt?: Date;

  @IsObject({ each: true })
  @Type(() => UpdateSplitPaymentDto)
  @IsOptional()
  splitPayments?: UpdateSplitPaymentDto[];
}
