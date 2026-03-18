import AppException from '@/core/exceptions/app_exception';
import BaseRepository from '@/core/interface/base.repository';
import AsyncResult from '@/core/types/async_result';
import Nil from '@/core/types/nil';
import Unit from '@/core/types/unit';
import PageEntity from '@/modules/pagination/domain/entities/page.entity';
import PageOptionsEntity from '@/modules/pagination/domain/entities/page_options.entity';
import ReportEntity, {
  ReportStatus,
} from '@/modules/transactions/domain/entities/report.entity';
import ReportModel from '@/modules/transactions/infra/models/report.model';

export interface ReportQueryOptions {
  userId: number;
  options: PageOptionsEntity;
  categoryIds?: string[];
  status?: ReportStatus;
  startDate?: Date;
  endDate?: Date;
}

export interface ReportReadModel {
  id: string;
  userId: number;
  categoryIds: string[];
  startDate: Date;
  endDate: Date;
  pdfUrl: string | null;
  status: ReportStatus;
  totalIncome: number;
  totalExpense: number;
  createdAt: Date;
  updatedAt: Date;
}

export default interface IReportRepository
  extends BaseRepository<ReportEntity, ReportModel> {
  findById(id: string): AsyncResult<AppException, ReportEntity | Nil>;

  findByIdAndUserId(id: string): AsyncResult<AppException, ReportEntity | Nil>;

  findByFiltersPagination(
    query: ReportQueryOptions,
  ): AsyncResult<AppException, PageEntity<ReportReadModel>>;

  delete(
    id: string,
  ): AsyncResult<AppException, Unit> | Promise<AsyncResult<AppException, Unit>>;
}
