import TransactionCategoryType from '@/modules/transactions/domain/entities/transaction_category_enum';
import TransactionCategoryDto from '@/modules/transactions/dtos/transaction_category.dto';
import { PickType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateTransactionCategoryDto extends PickType(
  TransactionCategoryDto,
  ['name', 'description', 'types'] as const,
) {
  @IsString()
  @MinLength(3)
  declare name: string;

  @Transform(({ value }: { value?: string }) => {
    if (value) {
      return value.length < 3 ? null : value;
    }
    return null;
  })
  @IsString()
  @IsOptional()
  declare description: string | null;

  @IsEnum(TransactionCategoryType, { each: true })
  types: TransactionCategoryType[];
}
