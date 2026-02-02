import { BaseModelPrimaryColumnUuid } from '@/core/interface/base_model';
import { Column, Entity } from 'typeorm';

@Entity('payment_methods')
export default class PaymentMethodModel extends BaseModelPrimaryColumnUuid {
  @Column('varchar', { length: 100 })
  name: string;

  @Column('varchar', { length: 255, nullable: true })
  description: string | null;
}
