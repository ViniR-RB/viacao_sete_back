import UserRole from '@/modules/users/domain/entities/user.role';

export const VALID_USER_PROPS = {
  email: 'valid@email.com',
  name: 'Valid User',
  password: 'StrongPassword123',
  role: UserRole.ADMIN,
};
