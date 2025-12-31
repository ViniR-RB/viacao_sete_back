import EmailValidator from '@/core/validators/email.validator';
import NameValidator from '@/core/validators/name.validator';
import PasswordValidator from '@/core/validators/password.validator';
import UserRole from '@/modules/users/domain/entities/user.role';
import UserDomainException from '@/modules/users/exceptions/user_domain_exception';

interface UserEntityProps {
  id?: number;
  email: string;
  name: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export default class UserEntity {
  private constructor(private readonly props: UserEntityProps) {
    this.props = {
      id: props.id,
      email: props.email,
      name: props.name,
      password: props.password,
      role: props.role,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    };
  }

  private static validade(props: Partial<UserEntityProps>) {
    if (props.email !== undefined && !EmailValidator.validate(props.email)) {
      throw new UserDomainException('Invalid email');
    }
    if (props.name !== undefined && !NameValidator.validate(props.name)) {
      throw new UserDomainException('Invalid name');
    }
    if (
      props.password !== undefined &&
      !PasswordValidator.validate(props.password)
    ) {
      throw new UserDomainException('Invalid password');
    }
    if (props.role && !UserRole[props.role]) {
      throw new UserDomainException('Invalid Role');
    }
  }

  static create(
    props: Omit<UserEntityProps, 'id' | 'createdAt' | 'updatedAt'>,
  ) {
    this.validade(props);
    return new UserEntity({
      ...props,
      id: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static fromData(props: UserEntityProps) {
    return new UserEntity(props);
  }

  changePassword(newPasswordHash: string) {
    this.props.password = newPasswordHash;
  }

  get id() {
    if (!this.props.id) {
      throw new UserDomainException('User Id has no generated');
    }
    return this.props.id!;
  }
  get email() {
    return this.props.email!;
  }

  get password() {
    return this.props.password;
  }
  get role() {
    return this.props.role;
  }
  get createdAt() {
    return this.props.createdAt!;
  }
  get updatedAt() {
    return this.props.updatedAt!;
  }

  toObject() {
    return {
      id: this.props.id,
      email: this.props.email,
      name: this.props.name,
      password: this.props.password,
      role: this.props.role,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }
}
