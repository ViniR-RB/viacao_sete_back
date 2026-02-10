import CoreModule from '@/core/core_module';
import IUnitOfWork from '@/core/interface/i_unit_of_work';
import { UNIT_OF_WORK } from '@/core/symbols';
import AuthModule from '@/modules/auth/auth.module';
import IPaymentMethodRepository from '@/modules/transactions/adapters/i_payment_method.repository';
import ITransactionCategoryRepository from '@/modules/transactions/adapters/i_transaction_category.repository';
import CreatePaymentMethodService from '@/modules/transactions/application/create_payment_method.service';
import CreateTransactionService from '@/modules/transactions/application/create_transaction.service';
import CreateTransactionCategoryService from '@/modules/transactions/application/create_transaction_category.service';
import DeletePaymentMethodService from '@/modules/transactions/application/delete_payment_method.service';
import DeleteTransactionService from '@/modules/transactions/application/delete_transaction.service';
import DeleteTransactionCategoryService from '@/modules/transactions/application/delete_transaction_category.service';
import ExtractTransactionSummaryService from '@/modules/transactions/application/extract_transaction_summary.service';
import ListPaymentMethodsService from '@/modules/transactions/application/list_payment_methods.service';
import ListTransactionCategoriesService from '@/modules/transactions/application/list_transaction_categories.service';
import ListTransactionsService from '@/modules/transactions/application/list_transactions.service';
import UpdateTransactionService from '@/modules/transactions/application/update_transaction.service';
import UpdateTransactionCategoryService from '@/modules/transactions/application/update_transaction_category.service';
import PaymentMethodController from '@/modules/transactions/controller/payment-method.controller';
import TransactionsController from '@/modules/transactions/controller/transactions.controller';
import PaymentMethodModel from '@/modules/transactions/infra/models/payment-method.model';
import SplitPaymentModel from '@/modules/transactions/infra/models/split_payment.model';
import TransactionCategoryModel from '@/modules/transactions/infra/models/transaction-category.model';
import TransactionModel from '@/modules/transactions/infra/models/transaction.model';
import TransactionLineDetailsModel from '@/modules/transactions/infra/models/transaction_line_details.model';
import PaymentMethodRepository from '@/modules/transactions/infra/repositories/payment-method.repository';
import TransactionCategoryRepository from '@/modules/transactions/infra/repositories/transaction-category.repository';
import TransactionRepository from '@/modules/transactions/infra/repositories/transaction.repository';
import {
  CREATE_PAYMENT_METHOD_SERVICE,
  CREATE_TRANSACTION_CATEGORY_SERVICE,
  CREATE_TRANSACTION_SERVICE,
  DELETE_PAYMENT_METHOD_SERVICE,
  DELETE_TRANSACTION_CATEGORY_SERVICE,
  DELETE_TRANSACTION_SERVICE,
  EXTRACT_TRANSACTION_SUMMARY_SERVICE,
  LIST_PAYMENT_METHODS_SERVICE,
  LIST_TRANSACTION_CATEGORIES_SERVICE,
  LIST_TRANSACTIONS_SERVICE,
  PAYMENT_METHOD_REPOSITORY,
  TRANSACTION_CATEGORY_REPOSITORY,
  TRANSACTION_REPOSITORY,
  UPDATE_TRANSACTION_CATEGORY_SERVICE,
  UPDATE_TRANSACTION_SERVICE,
} from '@/modules/transactions/symbols';
import { Module } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TransactionModel,
      TransactionCategoryModel,
      TransactionLineDetailsModel,
      PaymentMethodModel,
      SplitPaymentModel,
    ]),
    AuthModule,
    CoreModule,
  ],
  controllers: [TransactionsController, PaymentMethodController],
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
      inject: [getRepositoryToken(PaymentMethodModel)],
      provide: PAYMENT_METHOD_REPOSITORY,
      useFactory: (repo: Repository<PaymentMethodModel>) =>
        new PaymentMethodRepository(repo),
    },
    {
      inject: [
        UNIT_OF_WORK,
        TRANSACTION_CATEGORY_REPOSITORY,
        PAYMENT_METHOD_REPOSITORY,
      ],
      provide: CREATE_TRANSACTION_SERVICE,
      useFactory: (
        unitOfWork: IUnitOfWork,
        categoryRepository: ITransactionCategoryRepository,
        paymentMethodRepository: IPaymentMethodRepository,
      ) =>
        new CreateTransactionService(
          categoryRepository,
          paymentMethodRepository,
          unitOfWork,
        ),
    },
    {
      inject: [
        UNIT_OF_WORK,
        TRANSACTION_CATEGORY_REPOSITORY,
        PAYMENT_METHOD_REPOSITORY,
      ],
      provide: UPDATE_TRANSACTION_SERVICE,
      useFactory: (
        unitOfWork: IUnitOfWork,
        categoryRepository: ITransactionCategoryRepository,
        paymentMethodRepository: IPaymentMethodRepository,
      ) =>
        new UpdateTransactionService(
          unitOfWork,
          categoryRepository,
          paymentMethodRepository,
        ),
    },
    {
      inject: [UNIT_OF_WORK],
      provide: DELETE_TRANSACTION_SERVICE,
      useFactory: (unitOfWork: IUnitOfWork) =>
        new DeleteTransactionService(unitOfWork),
    },
    {
      inject: [TRANSACTION_CATEGORY_REPOSITORY],
      provide: CREATE_TRANSACTION_CATEGORY_SERVICE,
      useFactory: (categoryRepository: ITransactionCategoryRepository) =>
        new CreateTransactionCategoryService(categoryRepository),
    },
    {
      inject: [TRANSACTION_CATEGORY_REPOSITORY],
      provide: UPDATE_TRANSACTION_CATEGORY_SERVICE,
      useFactory: (categoryRepository: ITransactionCategoryRepository) =>
        new UpdateTransactionCategoryService(categoryRepository),
    },
    {
      inject: [TRANSACTION_CATEGORY_REPOSITORY],
      provide: DELETE_TRANSACTION_CATEGORY_SERVICE,
      useFactory: (categoryRepository: ITransactionCategoryRepository) =>
        new DeleteTransactionCategoryService(categoryRepository),
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
      inject: [TRANSACTION_REPOSITORY],
      provide: EXTRACT_TRANSACTION_SUMMARY_SERVICE,
      useFactory: (transactionRepository: TransactionRepository) =>
        new ExtractTransactionSummaryService(transactionRepository),
    },
    {
      inject: [PAYMENT_METHOD_REPOSITORY],
      provide: CREATE_PAYMENT_METHOD_SERVICE,
      useFactory: (paymentMethodRepository: IPaymentMethodRepository) =>
        new CreatePaymentMethodService(paymentMethodRepository),
    },
    {
      inject: [PAYMENT_METHOD_REPOSITORY],
      provide: LIST_PAYMENT_METHODS_SERVICE,
      useFactory: (paymentMethodRepository: IPaymentMethodRepository) =>
        new ListPaymentMethodsService(paymentMethodRepository),
    },
    {
      inject: [PAYMENT_METHOD_REPOSITORY],
      provide: DELETE_PAYMENT_METHOD_SERVICE,
      useFactory: (paymentMethodRepository: IPaymentMethodRepository) =>
        new DeletePaymentMethodService(paymentMethodRepository),
    },
  ],
})
export default class TransactionsModule {}
