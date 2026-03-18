import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import Nil, { nil } from '@/core/types/nil';
import Unit, { unit } from '@/core/types/unit';
import PageEntity from '@/modules/pagination/domain/entities/page.entity';
import PageMetaEntity from '@/modules/pagination/domain/entities/page_meta.entity';
import IReportRepository, {
  ReportQueryOptions,
  ReportReadModel,
} from '@/modules/transactions/adapters/i_report.repository';
import ReportEntity from '@/modules/transactions/domain/entities/report.entity';
import ReportRepositoryException from '@/modules/transactions/exceptions/report_repository.exception';
import ReportMapper from '@/modules/transactions/infra/mapper/report.mapper';
import ReportModel from '@/modules/transactions/infra/models/report.model';
import { EntityManager, Repository } from 'typeorm';

export default class ReportRepository implements IReportRepository {
  private readonly repository: Repository<ReportModel>;

  constructor(repoOrManager: Repository<ReportModel> | EntityManager) {
    if (repoOrManager instanceof Repository) {
      this.repository = repoOrManager;
    } else {
      this.repository = repoOrManager.getRepository(ReportModel);
    }
  }
  create(entity: ReportEntity): ReportModel {
    return this.repository.create(ReportMapper.toModel(entity));
  }

  async save(entity: ReportEntity): AsyncResult<AppException, ReportEntity> {
    try {
      const model = this.create(entity);
      const entityResult = await this.repository.save(model);
      return right(ReportMapper.toEntity(entityResult));
    } catch (error) {
      return left(
        new ReportRepositoryException(
          ErrorMessages.UNEXPECTED_ERROR,
          500,
          error,
        ),
      );
    }
  }

  async findById(id: string): AsyncResult<AppException, ReportEntity | Nil> {
    try {
      const model = await this.repository.findOne({
        where: { id },
      });

      if (!model) {
        return right(Nil);
      }

      return right(ReportMapper.toEntity(model));
    } catch (error) {
      return left(
        new ReportRepositoryException(
          ErrorMessages.UNEXPECTED_ERROR,
          500,
          error,
        ),
      );
    }
  }

  async findByIdAndUserId(
    id: string,
  ): AsyncResult<AppException, ReportEntity | Nil> {
    try {
      const model = await this.repository.findOne({
        where: { id },
      });

      if (!model) {
        return right(nil);
      }

      return right(ReportMapper.toEntity(model));
    } catch (error) {
      return left(
        new ReportRepositoryException(
          ErrorMessages.UNEXPECTED_ERROR,
          500,
          error,
        ),
      );
    }
  }

  async findByFiltersPagination(
    query: ReportQueryOptions,
  ): AsyncResult<AppException, PageEntity<ReportReadModel>> {
    try {
      let queryBuilder = this.repository
        .createQueryBuilder('r')
        .where('r.userId = :userId', {
          userId: query.userId,
        });

      if (query.categoryIds && query.categoryIds.length > 0) {
        queryBuilder = queryBuilder.andWhere('r.categoryIds && :categoryIds', {
          categoryIds: query.categoryIds,
        });
      }

      if (query.status) {
        queryBuilder = queryBuilder.andWhere('r.status = :status', {
          status: query.status,
        });
      }

      if (query.startDate && query.endDate) {
        queryBuilder = queryBuilder.andWhere(
          'r.createdAt BETWEEN :startDate AND :endDate',
          {
            startDate: query.startDate,
            endDate: query.endDate,
          },
        );
      } else if (query.startDate) {
        queryBuilder = queryBuilder.andWhere('r.createdAt >= :startDate', {
          startDate: query.startDate,
        });
      } else if (query.endDate) {
        queryBuilder = queryBuilder.andWhere('r.createdAt <= :endDate', {
          endDate: query.endDate,
        });
      }

      const skip = (query.options.page - 1) * query.options.take;
      const take = query.options.take;

      const [models, total] = await queryBuilder
        .orderBy('r.createdAt', query.options.order)
        .skip(skip)
        .take(take)
        .getManyAndCount();

      const readModels: ReportReadModel[] = models.map(model => ({
        id: model.id,
        userId: model.userId,
        categoryIds: model.categoryIds,
        startDate: model.startDate,
        endDate: model.endDate,
        pdfUrl: model.pdfUrl,
        status: model.status,
        totalIncome: model.totalIncome,
        totalExpense: model.totalExpense,
        createdAt: model.createdAt,
        updatedAt: model.updatedAt,
      }));

      const pageMetaEntity = new PageMetaEntity({
        pageOptions: query.options,
        itemCount: total,
      });

      const pageEntity = new PageEntity(readModels, pageMetaEntity);

      return right(pageEntity);
    } catch (error) {
      return left(
        new ReportRepositoryException(
          ErrorMessages.UNEXPECTED_ERROR,
          500,
          error,
        ),
      );
    }
  }

  async delete(id: string): AsyncResult<AppException, Unit> {
    try {
      await this.repository.delete(id);
      return right(unit);
    } catch (error) {
      return left(
        new ReportRepositoryException(
          ErrorMessages.UNEXPECTED_ERROR,
          500,
          error,
        ),
      );
    }
  }
}
