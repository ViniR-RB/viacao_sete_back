import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class CreateTransactionCategoryDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => (value === '' ? null : value))
  description: string | null;
}
