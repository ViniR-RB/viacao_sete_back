import BaseMapper from '@/core/mappers/base.mapper';
import { Amount } from '@/core/value-objects/amount';
import TransactionLineDetailsEntity from '@/modules/transactions/domain/entities/transaction_line_details.entity';
import TransactionLineDetailsModel from '@/modules/transactions/infra/models/transaction_line_details.model';

export default abstract class TransactionLineDetailsMapper extends BaseMapper<
  TransactionLineDetailsEntity,
  TransactionLineDetailsModel
> {
  static toEntity(
    model: TransactionLineDetailsModel,
  ): TransactionLineDetailsEntity {
    return TransactionLineDetailsEntity.fromData({
      id: model.id,
      transactionId: model.transactionId,
      amountGo: Amount.fromCents(model.amountGo),
      amountReturn: Amount.fromCents(model.amountReturn),
      driveChange: Amount.fromCents(model.driveChange),
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }
  static toModel(
    entity: TransactionLineDetailsEntity,
  ): Partial<TransactionLineDetailsModel> {
    return {
      id: entity.id,
      transactionId: entity.transactionId,
      amountGo: entity.amountGo.inCents,
      amountReturn: entity.amountReturn.inCents,
      driveChange: entity.driveChange.inCents,
    };
  }
}
