import UserRole from '@/modules/users/domain/entities/user.role';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNumber,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export default class UserDto {
  @IsNumber()
  id: number;

  @IsString()
  @MinLength(3)
  name: string;

  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  @Length(6)
  password: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
