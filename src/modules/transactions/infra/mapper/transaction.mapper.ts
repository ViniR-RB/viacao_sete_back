import BaseMapper from '@/core/mappers/base.mapper';
import { Amount } from '@/core/value-objects/amount';
import TransactionWithCategoryReadModel from '@/modules/transactions/infra/read-models/transaction_with_category_read_model';
import TransactionEntity from '../../domain/entities/transaction.entity';
import TransactionModel from '../models/transaction.model';

export default abstract class TransactionMapper extends BaseMapper<
  TransactionEntity,
  TransactionModel
> {
  static toEntity(model: TransactionModel): TransactionEntity {
    return TransactionEntity.fromData({
      id: model.id,
      userId: model.userId,
      categoryId: model.categoryId,
      description: model.description,
      transactionLineDetailsId: model.transactionLineDetailsId,
      amount: Amount.fromCents(Number(model.amount)),
      type: model.type,
      attachmentsIds: model.attachmentsIds,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toModel(entity: TransactionEntity): Partial<TransactionModel> {
    return {
      id: entity.id,
      userId: entity.userId,
      categoryId: entity.categoryId,
      description: entity.description,
      amount: entity.amount.inCents,
      transactionLineDetailsId: entity.transactionLineDetailsId,
      attachmentsIds: entity.attachmentsIds,
      type: entity.type,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
  static toReadModelWithCategory(
    model: TransactionModel,
  ): TransactionWithCategoryReadModel {
    return {
      id: model.id,
      userId: model.userId,
      description: model.description,
      amount: Amount.fromCents(model.amount),
      type: model.type,
      attachmentsIds: model.attachmentsIds,
      transactionLineDetailsId: model.transactionLineDetailsId,
      lineDetails: model.transactionLineDetails
        ? {
            amountGo: Amount.fromCents(model.transactionLineDetails.amountGo),
            amountReturn: Amount.fromCents(
              model.transactionLineDetails.amountReturn,
            ),
            driveChange: Amount.fromCents(
              model.transactionLineDetails.driveChange,
            ),
          }
        : null,
      category: {
        id: model.category.id,
        name: model.category.name,
        description: model.category.name,
      },
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }
}
