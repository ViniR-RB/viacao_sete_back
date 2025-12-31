import { TransactionType } from '@/modules/transactions/domain/types/transaction-type';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class TransactionFiltersDto {
  @IsEnum(TransactionType)
  @IsOptional()
  type?: TransactionType;

  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;
}
