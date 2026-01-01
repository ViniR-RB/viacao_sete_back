import { IsString, IsOptional } from 'class-validator';

export class TransactionCategoryFiltersDto {
  @IsString()
  @IsOptional()
  name?: string;
}
