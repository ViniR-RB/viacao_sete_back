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
      transactionLineDetailsId: model.transactionLineDetailsId,
      category: {
        name: model.category.name,
        description: model.category.name,
      },
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }
}
