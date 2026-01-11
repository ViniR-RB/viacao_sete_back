import { User } from '@/core/decorators/user_request.decorator';
import AuthGuard from '@/core/guard/auth.guard';
import { PageOptionsDto } from '@/modules/pagination/dto/page_options.dto';
import ICreateTransactionCategoryUseCase from '@/modules/transactions/domain/usecase/i_create_transaction_category_use_case';
import ICreateTransactionUseCase from '@/modules/transactions/domain/usecase/i_create_transaction_use_case';
import IExtractTransactionSummaryUseCase, {
  ExtractPeriod,
} from '@/modules/transactions/domain/usecase/i_extract_transaction_summary_use_case';
import IListTransactionCategoriesUseCase from '@/modules/transactions/domain/usecase/i_list_transaction_categories_use_case';
import IListTransactionsUseCase from '@/modules/transactions/domain/usecase/i_list_transactions_use_case';
import { CreateTransactionDto } from '@/modules/transactions/dtos/create_transaction.dto';
import { CreateTransactionCategoryDto } from '@/modules/transactions/dtos/create_transaction_category.dto';
import { TransactionCategoryFiltersDto } from '@/modules/transactions/dtos/transaction_category_filters.dto';
import { TransactionFiltersDto } from '@/modules/transactions/dtos/transaction_filters.dto';
import {
  CREATE_TRANSACTION_CATEGORY_SERVICE,
  CREATE_TRANSACTION_SERVICE,
  EXTRACT_TRANSACTION_SUMMARY_SERVICE,
  LIST_TRANSACTION_CATEGORIES_SERVICE,
  LIST_TRANSACTIONS_SERVICE,
} from '@/modules/transactions/symbols';
import UserDto from '@/modules/users/dtos/user.dto';
import UserModel from '@/modules/users/infra/models/user.model';
import {
  Body,
  Controller,
  Get,
  HttpException,
  Inject,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

@Controller('api/transactions')
@UseGuards(AuthGuard)
export default class TransactionsController {
  constructor(
    @Inject(CREATE_TRANSACTION_SERVICE)
    private readonly createTransactionService: ICreateTransactionUseCase,
    @Inject(CREATE_TRANSACTION_CATEGORY_SERVICE)
    private readonly createTransactionCategoryService: ICreateTransactionCategoryUseCase,
    @Inject(LIST_TRANSACTIONS_SERVICE)
    private readonly listTransactionsService: IListTransactionsUseCase,
    @Inject(LIST_TRANSACTION_CATEGORIES_SERVICE)
    private readonly listTransactionCategoriesService: IListTransactionCategoriesUseCase,
    @Inject(EXTRACT_TRANSACTION_SUMMARY_SERVICE)
    private readonly extractTransactionSummaryService: IExtractTransactionSummaryUseCase,
  ) {}

  @Get('categories')
  async listCategories(
    @Query() options: PageOptionsDto,
    @Query() filters: TransactionCategoryFiltersDto,
  ) {
    const result = await this.listTransactionCategoriesService.execute({
      options,
      name: filters.name,
      type: filters.type,
    });

    if (result.isLeft()) {
      throw result.value;
    }

    return result.value.fromResponse();
  }

  @Post('categories')
  async createCategory(
    @Body() dto: CreateTransactionCategoryDto,
    @User() user: UserModel,
  ) {
    const result = await this.createTransactionCategoryService.execute({
      userId: user.id,
      name: dto.name,
      description: dto.description,
      types: dto.types,
    });

    if (result.isLeft()) {
      throw result.value;
    }

    return result.value.fromResponse();
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() dto: CreateTransactionDto, @User() user: UserModel) {
    const result = await this.createTransactionService.execute({
      userId: user.id,
      categoryId: dto.categoryId,
      description: dto.description,
      amount: dto.amount,
      type: dto.type,
      createdAt: dto.createdAt,
      trasactionLineDetails: dto.transactionLineDetails,
    });

    if (result.isLeft()) {
      throw result.value;
    }

    return result.value.fromResponse();
  }

  @Get()
  @UseGuards(AuthGuard)
  async list(
    @User() user: UserDto,
    @Query() options: PageOptionsDto,
    @Query() filters: TransactionFiltersDto,
  ) {
    const result = await this.listTransactionsService.execute({
      userId: user.id,
      options,
      type: filters.type,
      categoryId: filters.categoryId,
      startDate: filters.startDate ? new Date(filters.startDate) : undefined,
      endDate: filters.endDate ? new Date(filters.endDate) : undefined,
    });

    if (result.isLeft()) {
      throw result.value;
    }

    return result.value.fromResponse();
  }

  @Get('summary/:period')
  @UseGuards(AuthGuard)
  async extractSummary(@Param('period') period: string) {
    
    if (!Object.values(ExtractPeriod).includes(period as ExtractPeriod)) {
      throw new Error(
        `Invalid period. Must be one of: ${Object.values(ExtractPeriod).join(', ')}`,
      );
    }

    const result = await this.extractTransactionSummaryService.execute({
      period: period as ExtractPeriod,
    });

    if (result.isLeft()) {
      throw new HttpException(result.value.message, result.value.statusCode, {
        cause: result.value.cause,
      });
    }

    return result.value.fromResponse();
  }
}
