import IUnitOfWork from '@/core/interface/i_unit_of_work';
import ITransactionRepository from '@/modules/transactions/adapters/i_transaction.repository';
import ITransactionLineDetailsRepository from '@/modules/transactions/adapters/i_transaction_line_details.repository';
import TransactionRepository from '@/modules/transactions/infra/repositories/transaction.repository';
import TransactionLineDetailsRepository from '@/modules/transactions/infra/repositories/transaction_line_details.repository';
import { DataSource, QueryRunner } from 'typeorm';

export default class TypeormUnitOfWork implements IUnitOfWork {
  private queryRunner: QueryRunner;
  constructor(private dataSource: DataSource) {}
  getTransactionRepository(): ITransactionRepository {
    if (!this.queryRunner || !this.queryRunner.manager) {
      throw new Error(
        'Transaction not started. Call start() first when getTransactionRepository',
      );
    }
    return new TransactionRepository(this.queryRunner.manager);
  }
  getTransactionLineDetailsRepository(): ITransactionLineDetailsRepository {
    if (!this.queryRunner || !this.queryRunner.manager) {
      throw new Error(
        'Transaction not started. Call start() first when getTransactionLineDetailsRepository',
      );
    }
    return new TransactionLineDetailsRepository(this.queryRunner.manager);
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
