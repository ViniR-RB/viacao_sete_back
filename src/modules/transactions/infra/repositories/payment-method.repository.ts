import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import Unit, { unit } from '@/core/types/unit';
import PageEntity from '@/modules/pagination/domain/entities/page.entity';
import PageMetaEntity from '@/modules/pagination/domain/entities/page_meta.entity';
import PageOptionsEntity from '@/modules/pagination/domain/entities/page_options.entity';
import IPaymentMethodRepository from '@/modules/transactions/adapters/i_payment_method.repository';
import PaymentMethodEntity from '@/modules/transactions/domain/entities/payment-method.entity';
import { PaymentMethodRepositoryException } from '@/modules/transactions/exceptions/payment_method_repository.exception';
import PaymentMethodMapper from '@/modules/transactions/infra/mapper/payment-method.mapper';
import PaymentMethodModel from '@/modules/transactions/infra/models/payment-method.model';
import { Repository } from 'typeorm';

export default class PaymentMethodRepository
  implements IPaymentMethodRepository
{
  constructor(private readonly repository: Repository<PaymentMethodModel>) {}

  create(entity: PaymentMethodEntity): PaymentMethodModel {
    return this.repository.create(PaymentMethodMapper.toModel(entity));
  }
  async findMany(
    options: PageOptionsEntity,
    name?: string,
  ): AsyncResult<AppException, PageEntity<PaymentMethodEntity>> {
    try {
      const queryBuilder = this.repository.createQueryBuilder('payment_method');

      if (name) {
        queryBuilder.where('payment_method.name LIKE :name', {
          name: `%${name}%`,
        });
      }
      queryBuilder.orderBy('payment_method.createdAt', options.order);
      queryBuilder.skip(options.skip).take(options.take);

      const [models, total] = await queryBuilder.getManyAndCount();

      const entities = models.map(PaymentMethodMapper.toEntity);
      const pageMeta = new PageMetaEntity({
        pageOptions: options,
        itemCount: total,
      });
      const pageEntity = new PageEntity(entities, pageMeta);
      return right(pageEntity);
    } catch (e) {
      return left(
        new PaymentMethodRepositoryException(
          ErrorMessages.UNEXPECTED_ERROR,
          500,
          e,
        ),
      );
    }
  }

  async save(
    entity: PaymentMethodEntity,
  ): AsyncResult<AppException, PaymentMethodEntity> {
    try {
      const model = this.create(entity);
      const savedModel = await this.repository.save(model);
      const entityResult = PaymentMethodMapper.toEntity(savedModel);

      return right(entityResult);
    } catch (error) {
      return left(
        new PaymentMethodRepositoryException(ErrorMessages.UNEXPECTED_ERROR),
      );
    }
  }

  async findOneById(
    id: string,
  ): AsyncResult<AppException, PaymentMethodEntity> {
    try {
      const model = await this.repository.findOne({
        where: { id },
      });

      if (!model) {
        return left(PaymentMethodRepositoryException.notFound(id));
      }

      const entity = PaymentMethodMapper.toEntity(model);

      return right(entity);
    } catch (error) {
      return left(
        new PaymentMethodRepositoryException(ErrorMessages.UNEXPECTED_ERROR),
      );
    }
  }

  async findByName(
    name: string,
  ): AsyncResult<AppException, PaymentMethodEntity> {
    try {
      const model = await this.repository.findOne({
        where: { name },
      });

      if (!model) {
        return left(PaymentMethodRepositoryException.notFound());
      }

      const entity = PaymentMethodMapper.toEntity(model);

      return right(entity);
    } catch (error) {
      return left(
        new PaymentMethodRepositoryException(ErrorMessages.UNEXPECTED_ERROR),
      );
    }
  }

  async delete(id: string): AsyncResult<AppException, Unit> {
    try {
      await this.repository.delete({ id });
      return right(unit);
    } catch (error) {
      return left(
        new PaymentMethodRepositoryException(ErrorMessages.UNEXPECTED_ERROR),
      );
    }
  }
}
