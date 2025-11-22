import {
  CreateDateColumn,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseModel {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export class BaseModelPrimaryColumnUuid extends BaseModel {
  @PrimaryColumn()
  id: string;
}

export class BaseModelIdGeneratedIncrement extends BaseModel {
  @PrimaryGeneratedColumn('increment')
  id: number;
}
