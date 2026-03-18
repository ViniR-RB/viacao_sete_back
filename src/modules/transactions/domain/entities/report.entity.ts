export interface ReportEntityProps {
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

export enum ReportStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export default class ReportEntity {
  private constructor(private readonly props: ReportEntityProps) {}

  static create(
    props: Omit<
      ReportEntityProps,
      | 'id'
      | 'createdAt'
      | 'updatedAt'
      | 'pdfUrl'
      | 'status'
      | 'totalIncome'
      | 'totalExpense'
    > & {
      id?: string;
    },
  ) {
    const propsValid: ReportEntityProps = {
      ...props,
      id: props.id || crypto.randomUUID(),
      pdfUrl: null,
      status: ReportStatus.PENDING,
      totalIncome: 0,
      totalExpense: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return new ReportEntity(propsValid);
  }

  static fromData(props: ReportEntityProps) {
    return new ReportEntity(props);
  }

  get id() {
    return this.props.id;
  }

  get userId() {
    return this.props.userId;
  }

  get categoryIds() {
    return this.props.categoryIds;
  }

  get startDate() {
    return this.props.startDate;
  }

  get endDate() {
    return this.props.endDate;
  }

  get pdfUrl() {
    return this.props.pdfUrl;
  }

  get status() {
    return this.props.status;
  }

  get totalIncome() {
    return this.props.totalIncome;
  }

  get totalExpense() {
    return this.props.totalExpense;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  updateStatus(status: ReportStatus) {
    this.props.status = status;
    this.props.updatedAt = new Date();
  }

  updatePdfUrl(pdfUrl: string) {
    this.props.pdfUrl = pdfUrl;
    this.props.updatedAt = new Date();
  }

  updateTotals(totalIncome: number, totalExpense: number) {
    this.props.totalIncome = totalIncome;
    this.props.totalExpense = totalExpense;
    this.props.updatedAt = new Date();
  }

  toObject() {
    return {
      id: this.props.id,
      userId: this.props.userId,
      categoryIds: this.props.categoryIds,
      startDate: this.props.startDate,
      endDate: this.props.endDate,
      pdfUrl: this.props.pdfUrl,
      status: this.props.status,
      totalIncome: this.props.totalIncome,
      totalExpense: this.props.totalExpense,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }
}
