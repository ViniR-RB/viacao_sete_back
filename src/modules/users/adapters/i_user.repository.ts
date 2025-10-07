import AppException from '@/core/exceptions/app_exception';
import BaseRepository from '@/core/interface/base.repository';
import AsyncResult from '@/core/types/async_result';
import UserEntity from '@/modules/users/domain/entities/user.entity';
import UserModel from '@/modules/users/infra/models/user.model';
import { UserQueryOptions } from '@/modules/users/infra/query/query_objects';

export default interface IUserRepository extends BaseRepository<UserEntity,UserModel> {
  findOne(query: UserQueryOptions): AsyncResult<AppException, UserEntity>;
}
