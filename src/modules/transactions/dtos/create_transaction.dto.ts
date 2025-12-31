import { TransactionDto } from '@/modules/transactions/dtos/transaction.dto';
import { PickType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';

export class CreateTransactionDto extends PickType(TransactionDto, [
  'categoryId',
  'description',
  'amount',
  'type',
] as const) {
  @Transform(({ value }: { value?: Date }) => {
    if (!value) {
      return null;
    }
    if (typeof value === 'string') {
      return new Date(value);
    }
    return value;
  })
  @IsDate()
  @IsOptional()
  createdAt: Date | null;
}
