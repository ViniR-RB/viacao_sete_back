import CreateSplitPaymentDto from '@/modules/transactions/dtos/create_split_payment.dto';
import { IsOptional } from 'class-validator';

export default class UpdateSplitPaymentDto extends CreateSplitPaymentDto {
  @IsOptional()
  id?: string;
}
