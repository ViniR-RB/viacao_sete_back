import UseCase from '@/core/interface/use_case';
import ReportEntity from '@/modules/transactions/domain/entities/report.entity';

export interface CreateReportParam {
  userId: number;
  categoryIds: string[];
  startDate: Date;
  endDate: Date;
}

export class CreateReportResponse {
  constructor(public readonly report: ReportEntity) {}

  fromResponse() {
    return this.report.toObject();
  }
}

export default interface ICreateReportUseCase
  extends UseCase<CreateReportParam, CreateReportResponse> {}
