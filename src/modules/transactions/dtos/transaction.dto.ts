import { TransactionType } from '@/modules/transactions/domain/types/transaction-type';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class TransactionDto {
  @IsString()
  id: string;

  @IsString()
  userId: string;

  @IsString()
  categoryId: string;

  @IsString()
  @MinLength(3)
  description: string;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsEnum(TransactionType)
  type: TransactionType;
  @IsDate()
  createdAt: Date;
  @IsDate()
  updatedAt: Date;
}
