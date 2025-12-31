import UserRole from '@/modules/users/domain/entities/user.role';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export default class UserModel {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'password', select: false })
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
