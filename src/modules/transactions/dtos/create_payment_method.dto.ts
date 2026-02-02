import { PaymentMethodDto } from '@/modules/transactions/dtos/payment_method.dto';
import { PickType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, MinLength } from 'class-validator';

export class CreatePaymentMethodDto extends PickType(PaymentMethodDto, [
  'name',
  'description',
]) {
  @IsString()
  @MinLength(3)
  declare name: string;

  @IsString()
  @MinLength(3)
  @Transform(({ value }: { value?: string }) => {
    if (value) {
      return value.length < 3 ? null : value;
    }
    return null;
  })
  declare description: string | null;
}
