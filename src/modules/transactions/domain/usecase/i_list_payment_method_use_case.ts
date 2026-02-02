import UseCase from '@/core/interface/use_case';
import PageEntity from '@/modules/pagination/domain/entities/page.entity';
import PageOptionsEntity from '@/modules/pagination/domain/entities/page_options.entity';
import PaymentMethodEntity from '@/modules/transactions/domain/entities/payment-method.entity';

export interface ListPaymentMethodsParam {
  options: PageOptionsEntity;
  name?: string;
}

export class ListPaymentMethodsResponse {
  constructor(
    public readonly paymentMethodPage: PageEntity<PaymentMethodEntity>,
  ) {}

  fromResponse() {
    return this.paymentMethodPage.toObject();
  }
}

export default interface IListPaymentMethodUseCase
  extends UseCase<ListPaymentMethodsParam, ListPaymentMethodsResponse> {}
