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
      amountGo: Amount.from(model.amountGo || 0),
      amountReturn: Amount.from(model.amountReturn || 0),
      driveChange: Amount.from(model.driveChange || 0),
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
      amountGo: entity.amountGo.getValue,
      amountReturn: entity.amountReturn.getValue,
      driveChange: entity.driveChange.getValue,
    };
  }
}
