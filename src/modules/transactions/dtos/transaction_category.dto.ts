import TransactionCategoryType from '@/modules/transactions/domain/entities/transaction_category_enum';
import { ApiProperty } from '@nestjs/swagger';

export default class TransactionCategoryDto {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
    description: 'Unique identifier for the transaction category',
  })
  id: string;

  @ApiProperty({
    example: 'Personal Expenses',
    description: 'Name of the transaction category',
  })
  name: string;

  @ApiProperty({
    example: 'Expenses related to personal items and services',
    description: 'Description of the transaction category',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    example: ['COMMON', 'AGENCY', 'LINE'],
    description: 'Types of category',
    isArray: true,
    enum: ['COMMON', 'AGENCY', 'LINE'],
  })
  types: TransactionCategoryType[];

  @ApiProperty({
    example: '2024-01-01T12:00:00Z',
    description: 'Timestamp when the category was created',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-10T15:30:00Z',
    description: 'Timestamp when the category was last updated',
  })
  updatedAt: Date;
}
