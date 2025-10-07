import BaseMapper from '@/core/mappers/base.mapper';
import UserEntity from '@/modules/users/domain/entities/user.entity';
import UserModel from '@/modules/users/infra/models/user.model';

export default abstract class UserMapper extends BaseMapper<UserEntity, UserModel> {
  static toEntity(userModel: UserModel): UserEntity {
    return UserEntity.fromData({
      id: userModel.id,
      password: userModel.password,
      email: userModel.email,
      name: userModel.name,
      createdAt: userModel.createdAt,
      updatedAt: userModel.updatedAt,
    });
  }

  static toModel(userEntity: UserEntity) {
    return {
      ...userEntity.toObject(),
    };
  }
}
