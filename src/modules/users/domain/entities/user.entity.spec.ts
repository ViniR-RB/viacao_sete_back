import { VALID_USER_PROPS } from '@test/constants/users/users.constants';
import UserEntity from './user.entity';

describe('UserEntity', () => {
  it('should create a valid user', () => {
    const user = UserEntity.create({
      ...VALID_USER_PROPS,
    });
    expect(user.email).toBe(VALID_USER_PROPS.email);
    expect(user.password).toBe(VALID_USER_PROPS.password);
    expect(user.role).toBe(VALID_USER_PROPS.role);
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.updatedAt).toBeInstanceOf(Date);
  });

  it('should throw an exception for invalid email', () => {
    expect(() =>
      UserEntity.create({
        ...VALID_USER_PROPS,
        email: 'invalid-email',
      }),
    ).toThrow('Invalid email');
  });

  it('should throw an exception for invalid name', () => {
    expect(() =>
      UserEntity.create({
        ...VALID_USER_PROPS,
        name: '',
      }),
    ).toThrow('Invalid name');
  });

  it('should throw an exception for invalid password', () => {
    expect(() =>
      UserEntity.create({
        ...VALID_USER_PROPS,
        password: '123',
      }),
    ).toThrow('Invalid password');
  });
});
