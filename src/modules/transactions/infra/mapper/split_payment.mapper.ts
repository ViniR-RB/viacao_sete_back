import BaseMapper from '@/core/mappers/base.mapper';
import { Amount } from '@/core/value-objects/amount';
import SplitPaymentEntity from '@/modules/transactions/domain/entities/split_payment.entity';
import SplitPaymentModel from '@/modules/transactions/infra/models/split_payment.model';

export default abstract class SplitPaymentMapper extends BaseMapper<
  SplitPaymentEntity,
  SplitPaymentModel
> {
  static toEntity(model: SplitPaymentModel): SplitPaymentEntity {
    return SplitPaymentEntity.fromData({
      amount: Amount.from(model.amount),
      id: model.id,
      paymentMethodId: model.paymentMethodId,
      transactionId: model.transactionId,
    });
  }
  static toModel(entity: SplitPaymentEntity): Partial<SplitPaymentModel> {
    const model = {
      id: entity.id,
      paymentMethodId: entity.paymentMethodId,
      transactionId: entity.transactionId,
      amount: entity.amount.getValue,
    };
    return {
      ...model,
    };
  }
}
