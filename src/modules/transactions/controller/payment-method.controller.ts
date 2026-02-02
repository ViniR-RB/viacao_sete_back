import { PageOptionsDto } from '@/modules/pagination/dto/page_options.dto';
import ICreatePaymentMethodUseCase from '@/modules/transactions/domain/usecase/i_create_payment_method_use_case';
import IDeletePaymentMethodUseCase from '@/modules/transactions/domain/usecase/i_delete_payment_method_use_case';
import IListPaymentMethodUseCase from '@/modules/transactions/domain/usecase/i_list_payment_method_use_case';
import { CreatePaymentMethodDto } from '@/modules/transactions/dtos/create_payment_method.dto';
import { PaymentMethodDto } from '@/modules/transactions/dtos/payment_method.dto';
import PaymentMethodFiltersDto from '@/modules/transactions/dtos/payment_method_filters.dto';
import {
  CREATE_PAYMENT_METHOD_SERVICE,
  DELETE_PAYMENT_METHOD_SERVICE,
  LIST_PAYMENT_METHODS_SERVICE,
} from '@/modules/transactions/symbols';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Inject,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Payment Methods')
@Controller('api/payment-methods')
export default class PaymentMethodController {
  constructor(
    @Inject(CREATE_PAYMENT_METHOD_SERVICE)
    private readonly createPaymentMethodService: ICreatePaymentMethodUseCase,
    @Inject(LIST_PAYMENT_METHODS_SERVICE)
    private readonly listPaymentMethodsService: IListPaymentMethodUseCase,

    @Inject(DELETE_PAYMENT_METHOD_SERVICE)
    private readonly deletePaymentMethodService: IDeletePaymentMethodUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new payment method' })
  @ApiResponse({
    status: 201,
    description: 'Payment method created successfully',
    type: PaymentMethodDto,
  })
  async create(@Body() dto: CreatePaymentMethodDto) {
    const result = await this.createPaymentMethodService.execute({
      name: dto.name,
      description: dto.description,
    });

    if (result.isLeft()) {
      throw new HttpException(result.value.message, result.value.statusCode, {
        cause: result.value,
      });
    }

    return result.value;
  }

  @Get()
  @ApiOperation({ summary: 'List all payment methods' })
  @ApiResponse({
    status: 200,
    description: 'List of payment methods',
  })
  async list(
    @Query() options: PageOptionsDto,
    @Query() filters: PaymentMethodFiltersDto,
  ) {
    const result = await this.listPaymentMethodsService.execute({
      options,
      name: filters.name,
    });

    if (result.isLeft()) {
      throw new HttpException(result.value.message, result.value.statusCode, {
        cause: result.value,
      });
    }

    return result.value.fromResponse();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a payment method' })
  @ApiResponse({
    status: 200,
    description: 'Payment method deleted successfully',
  })
  async delete(@Param('id') id: string) {
    const result = await this.deletePaymentMethodService.execute({
      id,
    });

    if (result.isLeft()) {
      throw new HttpException(result.value.message, result.value.statusCode, {
        cause: result.value,
      });
    }

    return result.value.fromResponse();
  }
}
