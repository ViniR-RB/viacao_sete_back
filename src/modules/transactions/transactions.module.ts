import CoreModule from '@/core/core_module';
import IUnitOfWork from '@/core/interface/i_unit_of_work';
import { UNIT_OF_WORK } from '@/core/symbols';
import AuthModule from '@/modules/auth/auth.module';
import ITransactionCategoryRepository from '@/modules/transactions/adapters/i_transaction_category.repository';
import CreateTransactionService from '@/modules/transactions/application/create_transaction.service';
import CreateTransactionCategoryService from '@/modules/transactions/application/create_transaction_category.service';
import ListTransactionCategoriesService from '@/modules/transactions/application/list_transaction_categories.service';
import ListTransactionsService from '@/modules/transactions/application/list_transactions.service';
import TransactionsController from '@/modules/transactions/controller/transactions.controller';
import TransactionCategoryModel from '@/modules/transactions/infra/models/transaction-category.model';
import TransactionModel from '@/modules/transactions/infra/models/transaction.model';
import TransactionLineDetailsModel from '@/modules/transactions/infra/models/transaction_line_details.model';
import TransactionCategoryRepository from '@/modules/transactions/infra/repositories/transaction-category.repository';
import TransactionRepository from '@/modules/transactions/infra/repositories/transaction.repository';
import TransactionLineDetailsRepository from '@/modules/transactions/infra/repositories/transaction_line_details.repository';
import {
  CREATE_TRANSACTION_CATEGORY_SERVICE,
  CREATE_TRANSACTION_SERVICE,
  LIST_TRANSACTION_CATEGORIES_SERVICE,
  LIST_TRANSACTIONS_SERVICE,
  TRANSACTION_CATEGORY_REPOSITORY,
  TRANSACTION_LINE_DETAILS_REPOSITORY,
  TRANSACTION_REPOSITORY,
} from '@/modules/transactions/symbols';
import { Module } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionModel, TransactionCategoryModel]),
    AuthModule,
    CoreModule,
  ],
  controllers: [TransactionsController],
  providers: [
    {
      inject: [getRepositoryToken(TransactionModel)],
      provide: TRANSACTION_REPOSITORY,
      useFactory: (transactionRepository: Repository<TransactionModel>) =>
        new TransactionRepository(transactionRepository),
    },
    {
      inject: [getRepositoryToken(TransactionCategoryModel)],
      provide: TRANSACTION_CATEGORY_REPOSITORY,
      useFactory: (categoryRepository: Repository<TransactionCategoryModel>) =>
        new TransactionCategoryRepository(categoryRepository),
    },
    {
      inject: [UNIT_OF_WORK, TRANSACTION_CATEGORY_REPOSITORY],
      provide: CREATE_TRANSACTION_SERVICE,
      useFactory: (
        unitOfWork: IUnitOfWork,
        categoryRepository: ITransactionCategoryRepository,
      ) => new CreateTransactionService(categoryRepository, unitOfWork),
    },
    {
      inject: [TRANSACTION_CATEGORY_REPOSITORY],
      provide: CREATE_TRANSACTION_CATEGORY_SERVICE,
      useFactory: (categoryRepository: ITransactionCategoryRepository) =>
        new CreateTransactionCategoryService(categoryRepository),
    },
    {
      inject: [TRANSACTION_REPOSITORY],
      provide: LIST_TRANSACTIONS_SERVICE,
      useFactory: (transactionRepository: TransactionRepository) =>
        new ListTransactionsService(transactionRepository),
    },
    {
      inject: [TRANSACTION_CATEGORY_REPOSITORY],
      provide: LIST_TRANSACTION_CATEGORIES_SERVICE,
      useFactory: (categoryRepository: ITransactionCategoryRepository) =>
        new ListTransactionCategoriesService(categoryRepository),
    },
    {
      inject: [getRepositoryToken(TransactionLineDetailsModel)],
      provide: TRANSACTION_LINE_DETAILS_REPOSITORY,
      useFactory: (repo: Repository<TransactionLineDetailsModel>) =>
        new TransactionLineDetailsRepository(repo),
    },
  ],
})
export default class TransactionsModule {}
