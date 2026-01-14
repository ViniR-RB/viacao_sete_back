import { TransactionType } from '@/modules/transactions/domain/types/transaction-type';
import { TransactionDto } from '@/modules/transactions/dtos/transaction.dto';
import TransactionLineDetailsDto from '@/modules/transactions/dtos/transaction_line_details.dto';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class CreateTransactionDto extends PickType(TransactionDto, [
  'categoryId',
  'description',
  'type',
] as const) {
  @IsUUID()
  declare categoryId: string;

  @Type(() => TransactionLineDetailsDto)
  @ValidateIf(obj => obj.transactionLineDetails !== null)
  declare transactionLineDetails: TransactionLineDetailsDto | null;

  @IsString()
  @MinLength(3)
  declare description: string;

  @ApiProperty({
    description: 'Transaction amount in currency',
    type: 'number',
    example: 150.5,
    nullable: true,
    required: false,
  })
  @Transform(({ value }: { value: number }) => {
    if (value === 0) {
      return null;
    }
    return value;
  })
  @ValidateIf(obj => obj.amount !== null && obj.amount !== undefined)
  @IsNumber()
  @IsPositive()
  declare amount: number | null;

  @IsEnum(TransactionType)
  declare type: TransactionType;

  @ApiProperty({
    description: 'Transaction creation date',
    example: '2024-01-07T10:30:00Z',
    examples: [
      '2024-01-07T10:30:00Z',
      '2024-06-15T08:20:00Z',
      '2024-12-31T23:59:59Z',
      null,
    ],
    required: false,
    nullable: true,
  })
  @Transform(({ value }: { value?: Date | string }) => {
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
