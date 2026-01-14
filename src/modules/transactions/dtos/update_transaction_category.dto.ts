import { CreateTransactionCategoryDto } from '@/modules/transactions/dtos/create_transaction_category.dto';
import { PickType } from '@nestjs/swagger';

export class UpdateTransactionCategoryDto extends PickType(
  CreateTransactionCategoryDto,
  ['name', 'description'],
) {}
