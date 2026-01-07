import TransactionCategoryType from '@/modules/transactions/domain/entities/transaction_category_enum';
import { IsString, IsOptional, IsEnum } from 'class-validator';

export class TransactionCategoryFiltersDto {
  @IsString()
  @IsOptional()
  name?: string;



  @IsEnum(TransactionCategoryType)
  @IsOptional()
  type?: TransactionCategoryType;
}
