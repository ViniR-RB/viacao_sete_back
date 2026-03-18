import { ReportStatus } from '@/modules/transactions/domain/entities/report.entity';
import UserModel from '@/modules/users/infra/models/user.model';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('reports')
export default class ReportModel {
  @PrimaryColumn('uuid')
  id: string;

  @Column('integer')
  userId: number;

  @ManyToOne(() => UserModel, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserModel;

  @Column('uuid', { array: true })
  categoryIds: string[];

  @Column('timestamp')
  startDate: Date;

  @Column('timestamp')
  endDate: Date;

  @Column('varchar', { nullable: true })
  pdfUrl: string | null;

  @Column({
    type: 'enum',
    enum: ReportStatus,
  })
  status: ReportStatus;

  @Column('bigint')
  totalIncome: number;

  @Column('bigint')
  totalExpense: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
