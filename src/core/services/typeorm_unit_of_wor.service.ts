import IUnitOfWork from '@/core/interface/i_unit_of_work';
import IAttachmentRepository from '@/modules/attachments/adapters/i_attachment.repository';
import AttachmentRepository from '@/modules/attachments/infra/repositories/attachment.repository';
import ITransactionRepository from '@/modules/transactions/adapters/i_transaction.repository';
import TransactionRepository from '@/modules/transactions/infra/repositories/transaction.repository';
import { DataSource, QueryRunner } from 'typeorm';

export default class TypeormUnitOfWork implements IUnitOfWork {
  private queryRunner: QueryRunner;
  constructor(private dataSource: DataSource) {}
  getAttachmentRepository(): IAttachmentRepository {
    if (!this.queryRunner || !this.queryRunner.manager) {
      throw new Error(
        'Transaction not started. Call start() first when getAttachmentRepository',
      );
    }
    return new AttachmentRepository(this.queryRunner.manager);
  }
  getTransactionRepository(): ITransactionRepository {
    if (!this.queryRunner || !this.queryRunner.manager) {
      throw new Error(
        'Transaction not started. Call start() first when getTransactionRepository',
      );
    }
    return new TransactionRepository(this.queryRunner.manager);
  }

  async start() {
    this.queryRunner = this.dataSource.createQueryRunner();
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
  }

  async commit() {
    await this.queryRunner.commitTransaction();
    await this.queryRunner.release();
  }

  async rollback() {
    await this.queryRunner.rollbackTransaction();
    await this.queryRunner.release();
  }
}
