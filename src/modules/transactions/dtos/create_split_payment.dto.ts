import SplitPaymentDto from '@/modules/transactions/dtos/split_payment.dto';
import { PickType } from '@nestjs/swagger';
import { IsNumber, IsPositive, IsUUID } from 'class-validator';

export default class CreateSplitPaymentDto extends PickType(SplitPaymentDto, [
  'paymentMethodId',
  'amount',
]) {
  @IsUUID()
  declare paymentMethodId: string;

  @IsPositive()
  @IsNumber()
  declare amount: number;
}
