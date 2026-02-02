import { IsOptional, IsString } from 'class-validator';

export default class PaymentMethodFiltersDto {
  @IsOptional()
  @IsString()
  name?: string;
}
