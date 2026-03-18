import ReportEntity, {
  ReportEntityProps,
} from '@/modules/transactions/domain/entities/report.entity';
import ReportModel from '@/modules/transactions/infra/models/report.model';

export default class ReportMapper {
  static toEntity(model: ReportModel): ReportEntity {
    const props: ReportEntityProps = {
      id: model.id,
      userId: model.userId,
      categoryIds: model.categoryIds,
      startDate: model.startDate,
      endDate: model.endDate,
      pdfUrl: model.pdfUrl,
      status: model.status as any,
      totalIncome: model.totalIncome,
      totalExpense: model.totalExpense,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };

    return ReportEntity.fromData(props);
  }

  static toModel(entity: ReportEntity): ReportModel {
    const model = new ReportModel();
    model.id = entity.id;
    model.userId = entity.userId;
    model.categoryIds = entity.categoryIds;
    model.startDate = entity.startDate;
    model.endDate = entity.endDate;
    model.pdfUrl = entity.pdfUrl;
    model.status = entity.status;
    model.totalIncome = entity.totalIncome;
    model.totalExpense = entity.totalExpense;
    model.createdAt = entity.createdAt;
    model.updatedAt = entity.updatedAt;

    return model;
  }
}
