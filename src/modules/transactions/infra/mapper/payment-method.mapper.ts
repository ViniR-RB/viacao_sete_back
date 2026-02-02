import BaseMapper from '@/core/mappers/base.mapper';
import PaymentMethodEntity from '@/modules/transactions/domain/entities/payment-method.entity';
import PaymentMethodModel from '@/modules/transactions/infra/models/payment-method.model';

export default abstract class PaymentMethodMapper extends BaseMapper<
  PaymentMethodEntity,
  PaymentMethodModel
> {
  static toEntity(model: PaymentMethodModel): PaymentMethodEntity {
    return PaymentMethodEntity.fromData({
      id: model.id,
      name: model.name,
      description: model.description,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toModel(entity: PaymentMethodEntity): Partial<PaymentMethodModel> {
    const obj = entity.toObject();

    return {
      id: obj.id,
      name: obj.name,
      description: obj.description,
      createdAt: obj.createdAt,
      updatedAt: obj.updatedAt,
    };
  }
}
