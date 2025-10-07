import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import IUserRepository from '@/modules/users/adapters/i_user.repository';
import UserEntity from '@/modules/users/domain/entities/user.entity';
import {
  UserRepositoryException,
  UserRepositoryNotFoundException,
} from '@/modules/users/exceptions/user_repository.exception';
import UserMapper from '@/modules/users/infra/mapper/user.mapper';
import UserModel from '@/modules/users/infra/models/user.model';
import { UserQueryOptions } from '@/modules/users/infra/query/query_objects';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, FindOneOptions, Repository } from 'typeorm';

export default class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserModel)
    private userRepository: Repository<UserModel>,
  ) {}
  create(entity: UserEntity): UserModel {
     const userModel = this.userRepository.create(UserMapper.toModel(entity));
     return userModel;
  }
  async findOne(
    query: UserQueryOptions,
  ): AsyncResult<AppException, UserEntity> {
    try {
      let options: FindOneOptions<UserModel> = {
        select: query.selectFields,
      };

      if (query.userEmail) {
        options = {
          ...options,
          where: { email: query.userEmail },
        };
      }
      if (query.userId) {
        options = {
          ...options,
          where: { id: query.userId },
        };
      }
      const userFinder = await this.userRepository.findOneOrFail(options);

      return right(UserMapper.toEntity(userFinder));
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        return left(new UserRepositoryNotFoundException());
      }

      return left(
        new UserRepositoryException(ErrorMessages.UNEXPECTED_ERROR, 500, error),
      );
    }
  }
  async save(user: UserEntity): AsyncResult<AppException, UserEntity> {
    try {
      const userModel = this.create(user);

      await this.userRepository.save(userModel);

      return right(UserMapper.toEntity(userModel));
    } catch (error) {
      return left(
        new UserRepositoryException(ErrorMessages.UNEXPECTED_ERROR, 500, error),
      );
    }
  }
}
