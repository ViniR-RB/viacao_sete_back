import UseCase from '@/core/interface/use_case';
import PageEntity from '@/modules/pagination/domain/entities/page.entity';
import PageOptionsEntity from '@/modules/pagination/domain/entities/page_options.entity';
import { ReportReadModel } from '@/modules/transactions/adapters/i_report.repository';
import { ReportStatus } from '@/modules/transactions/domain/entities/report.entity';

export interface ListReportsParam {
  userId: number;
  options: PageOptionsEntity;
  categoryIds?: string[];
  status?: ReportStatus;
  startDate?: Date;
  endDate?: Date;
}

export class ListReportsResponse {
  constructor(public readonly reportPage: PageEntity<ReportReadModel>) {}

  fromResponse() {
    return this.reportPage.toObject();
  }
}

export default interface IListReportsUseCase
  extends UseCase<ListReportsParam, ListReportsResponse> {}
