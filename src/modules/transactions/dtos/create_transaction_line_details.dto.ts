import TransactionLineDetailsDto from '@/modules/transactions/dtos/transaction_line_details.dto';
import { PickType } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

export default class CreateTransactionLineDetailsDto extends PickType(
  TransactionLineDetailsDto,
  ['amountGo', 'amountReturn', 'driveChange'] as const,
) {
  @IsNumber()
  @IsPositive()
  declare amountGo: number;
  @IsNumber()
  @IsPositive()
  declare amountReturn: number;
  @IsNumber()
  @IsPositive()
  declare driveChange: number;
}
