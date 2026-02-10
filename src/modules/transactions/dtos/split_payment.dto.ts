import { ApiProperty } from '@nestjs/swagger';

export default class SplitPaymentDto {
  @ApiProperty({
    description: 'Split Payment unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;
  @ApiProperty({
    description: 'Payment Method ID associated with this split payment',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  paymentMethodId: string;
  @ApiProperty({
    description: 'Transaction ID associated with this split payment',
    example: '123e4567-e89b-12d3-a456-426614174002',
  })
  transactionId: string;

  @ApiProperty({
    description: 'Amount allocated to this split payment in cents',
    type: 'number',
    example: 7525,
  })
  amount: number;
}
