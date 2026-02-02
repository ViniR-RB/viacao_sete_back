import AppException from '@/core/exceptions/app_exception';
import BaseRepository from '@/core/interface/base.repository';
import AsyncResult from '@/core/types/async_result';
import Unit from '@/core/types/unit';
import PageEntity from '@/modules/pagination/domain/entities/page.entity';
import PageOptionsEntity from '@/modules/pagination/domain/entities/page_options.entity';
import PaymentMethodEntity from '@/modules/transactions/domain/entities/payment-method.entity';
import PaymentMethodModel from '@/modules/transactions/infra/models/payment-method.model';

export default interface IPaymentMethodRepository
  extends BaseRepository<PaymentMethodEntity, PaymentMethodModel> {
  findOneById(id: string): AsyncResult<AppException, PaymentMethodEntity>;
  findByName(name: string): AsyncResult<AppException, PaymentMethodEntity>;
  findMany(
    options: PageOptionsEntity,
    name?: string,
  ): AsyncResult<AppException, PageEntity<PaymentMethodEntity>>;
  delete(id: string): AsyncResult<AppException, Unit>;
}
