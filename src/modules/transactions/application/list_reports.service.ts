import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import ServiceException from '@/core/exceptions/service.exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import IReportRepository from '@/modules/transactions/adapters/i_report.repository';
import IListReportsUseCase, {
  ListReportsParam,
  ListReportsResponse,
} from '@/modules/transactions/domain/usecase/i_list_reports_use_case';

export default class ListReportsService implements IListReportsUseCase {
  constructor(private readonly reportRepository: IReportRepository) {}

  async execute(
    param: ListReportsParam,
  ): AsyncResult<AppException, ListReportsResponse> {
    try {
      const result = await this.reportRepository.findByFiltersPagination({
        userId: param.userId,
        options: param.options,
        categoryIds: param.categoryIds,
        status: param.status,
        startDate: param.startDate,
        endDate: param.endDate,
      });

      if (result.isLeft()) {
        return left(result.value);
      }

      const reportPage = result.value;

      return right(new ListReportsResponse(reportPage));
    } catch (error) {
      return left(
        new ServiceException(ErrorMessages.UNEXPECTED_ERROR, 500, error),
      );
    }
  }
}
