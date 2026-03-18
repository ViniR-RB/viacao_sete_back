import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import ServiceException from '@/core/exceptions/service.exception';
import IUnitOfWork from '@/core/interface/i_unit_of_work';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import { IQueueService } from '@/modules/queue/adapters/i_queue.service';
import ITransactionCategoryRepository from '@/modules/transactions/adapters/i_transaction_category.repository';
import ReportEntity from '@/modules/transactions/domain/entities/report.entity';
import ICreateReportUseCase, {
  CreateReportParam,
  CreateReportResponse,
} from '@/modules/transactions/domain/usecase/i_create_report_use_case';

export default class CreateReportService implements ICreateReportUseCase {
  constructor(
    private readonly unitOfWork: IUnitOfWork,
    private readonly transactionCategoryRepository: ITransactionCategoryRepository,
    private readonly queueService: IQueueService,
  ) {}

  async execute(
    param: CreateReportParam,
  ): AsyncResult<AppException, CreateReportResponse> {
    try {
      await this.unitOfWork.start();

      const transactionCategoriesResult = await Promise.all(
        param.categoryIds.map(async categoryId => {
          return await this.transactionCategoryRepository.findOneById(
            categoryId,
          );
        }),
      );

      for (const result of transactionCategoriesResult) {
        if (result.isLeft()) {
          await this.unitOfWork.rollback();
          return left(result.value);
        }
      }

      const reportRepository = this.unitOfWork.getReportRepository();

      const reportEntity = ReportEntity.create({
        userId: param.userId,
        categoryIds: param.categoryIds,
        startDate: param.startDate,
        endDate: param.endDate,
      });

      const saveReportResult = await reportRepository.save(reportEntity);

      if (saveReportResult.isLeft()) {
        await this.unitOfWork.rollback();
        return left(saveReportResult.value);
      }

      const savedReport = saveReportResult.value;

      await this.queueService.addJob('default', 'generateReport', {
        reportId: savedReport.id,
        userId: param.userId,
        categoryIds: param.categoryIds,
        startDate: param.startDate,
        endDate: param.endDate,
      });

      await this.unitOfWork.commit();

      return right(new CreateReportResponse(savedReport));
    } catch (error) {
      await this.unitOfWork.rollback();
      if (error instanceof AppException) {
        return left(error);
      }
      return left(
        new ServiceException(ErrorMessages.UNEXPECTED_ERROR, 500, error),
      );
    }
  }
}
