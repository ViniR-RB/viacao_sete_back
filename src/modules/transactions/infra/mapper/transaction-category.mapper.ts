import BaseMapper from '@/core/mappers/base.mapper';
import TransactionCategoryEntity from '@/modules/transactions/domain/entities/transaction-category.entity';
import TransactionCategoryModel from '@/modules/transactions/infra/models/transaction-category.model';

export default abstract class TransactionCategoryMapper extends BaseMapper<
  TransactionCategoryEntity,
  TransactionCategoryModel
> {
  static toEntity(model: TransactionCategoryModel): TransactionCategoryEntity {
    return TransactionCategoryEntity.fromData({
      id: model.id,
      userId: model.userId,
      name: model.name,
      description: model.description,
      types: model.types,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toModel(
    entity: TransactionCategoryEntity,
  ): Partial<TransactionCategoryModel> {
    return {
      id: entity.id,
      userId: entity.userId,
      name: entity.name,
      types: entity.types,
      description: entity.description,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
