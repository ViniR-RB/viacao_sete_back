import BaseMapper from '@/core/mappers/base.mapper';
import { Amount } from '@/core/value-objects/amount';
import TransactionEntity from '@/modules/transactions/domain/entities/transaction.entity';
import TransactionLineDetailsMapper from '@/modules/transactions/infra/mapper/transaction_line_details.mapper';
import TransactionModel from '@/modules/transactions/infra/models/transaction.model';
import TransactionWithCategoryReadModel from '@/modules/transactions/infra/read-models/transaction_with_category_read_model';

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
      paymentMethodId: model.paymentMethodId,
      transactionLineDetails: model.transactionLineDetails
        ? TransactionLineDetailsMapper.toEntity(model.transactionLineDetails)
        : null,
      amount: Amount.from(model.amount),
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
      amount: entity.amount.getValue,
      paymentMethodId: entity.paymentMethodId,
      transactionLineDetails: entity.transactionLineDetails
        ? TransactionLineDetailsMapper.toModel(entity.transactionLineDetails)
        : null,
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
      amount: Amount.from(model.amount),
      type: model.type,
      attachmentsIds: model.attachmentsIds,
      lineDetails:
        model.transactionLineDetails !== null &&
        model.transactionLineDetails.amountGo &&
        model.transactionLineDetails.amountReturn &&
        model.transactionLineDetails.driveChange
          ? {
              amountGo: Amount.from(model.transactionLineDetails.amountGo),
              amountReturn: Amount.from(
                model.transactionLineDetails.amountReturn,
              ),
              driveChange: Amount.from(
                model.transactionLineDetails.driveChange,
              ),
            }
          : null,
      category: {
        id: model.category.id,
        name: model.category.name,
        description: model.category.name,
      },
      paymentMethodId: model.paymentMethodId,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }
}
