import UserDto from '@/modules/users/dtos/user.dto';
import { PickType } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export default class Credentials extends PickType(UserDto, [
  'email',
  'password',
]) {
  @IsEmail()
  email: string;

  @IsString()
  @Length(6)
  password: string;
}
