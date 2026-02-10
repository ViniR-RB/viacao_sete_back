import { TransactionType } from '@/modules/transactions/domain/types/transaction-type';
import SplitPaymentDto from '@/modules/transactions/dtos/split_payment.dto';
import TransactionLineDetailsDto from '@/modules/transactions/dtos/transaction_line_details.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, IsString, MinLength } from 'class-validator';

export class TransactionDto {
  @ApiProperty({
    description: 'Transaction unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'User ID that owns this transaction',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  userId: string;

  @ApiProperty({
    description: 'Category ID of this transaction',
    example: '123e4567-e89b-12d3-a456-426614174002',
  })
  categoryId: string;

  @ApiProperty({
    description: 'Transaction description',
    minLength: 3,
    example: 'Purchase at supermarket',
  })
  @IsString()
  @MinLength(3)
  description: string;

  @ApiProperty({
    description: 'Transaction amount in currency',
    type: 'number',
    example: 150.5,
  })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({
    description: 'List of split payments associated with this transaction',
    type: () => [SplitPaymentDto],
  })
  splitPayments: Array<SplitPaymentDto>;

  @ApiProperty({
    description: 'Transaction line details',
    type: () => TransactionLineDetailsDto,
    nullable: true,
    example: {
      id: '123e4567-e89b-12d3-a456-426614174004',
      transactionId: '123e4567-e89b-12d3-a456-426614174000',
      amountGo: 20000,
      amountReturn: 5000,
      driveChange: 15000,
      createdAt: '2024-01-07T10:30:00Z',
      updatedAt: '2024-01-07T15:45:00Z',
    },
  })
  transactionLineDetails: TransactionLineDetailsDto | null;

  @ApiProperty({
    description: 'Transaction type',
    enum: TransactionType,
    example: TransactionType.EXPENSE,
  })
  type: TransactionType;

  @ApiProperty({
    description: 'Transaction creation date',
    example: '2024-01-07T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Transaction last update date',
    example: '2024-01-07T15:45:00Z',
  })
  updatedAt: Date;
}
