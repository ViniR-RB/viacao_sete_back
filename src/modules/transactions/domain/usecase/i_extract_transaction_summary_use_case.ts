import UseCase from '@/core/interface/use_case';
import { Amount } from '@/core/value-objects/amount';
import {
  BreakdownSummary,
  DailyTransactionSummary,
  MonthlyTransactionSummary,
} from '@/modules/transactions/domain/entities/transaction_breakdown';

export enum ExtractPeriod {
  TWELVE_MONTHS = 'TWELVE_MONTHS',
  LAST_30_DAYS = 'LAST_30_DAYS',
}

export interface ExtractTransactionSummaryParam {
  period: ExtractPeriod;
}

export class ExtractTransactionSummaryResponse {
  constructor(
    public readonly totalIncome: Amount,
    public readonly totalExpense: Amount,
    public readonly netTotal: Amount,
    public readonly period: ExtractPeriod,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly breakdown: BreakdownSummary,
  ) {}

  fromResponse() {
    return {
      totalIncome: this.totalIncome.inReais,
      totalExpense: this.totalExpense.inReais,
      netTotal: this.netTotal.inReais,
      period: this.period,
      startDate: this.startDate,
      endDate: this.endDate,
      breakdown:
        this.period === ExtractPeriod.LAST_30_DAYS
          ? this.breakdownDailyToResponse(
              this.breakdown as DailyTransactionSummary[],
            )
          : this.breakdownMonthlyToResponse(
              this.breakdown as MonthlyTransactionSummary[],
            ),
    };
  }

  private breakdownDailyToResponse(breakdown: DailyTransactionSummary[]) {
    return breakdown.map(item => ({
      day: item.day,
      income: item.income.inReais,
      expense: item.expense.inReais,
    }));
  }

  private breakdownMonthlyToResponse(breakdown: MonthlyTransactionSummary[]) {
    return breakdown.map(item => ({
      month: item.month,
      income: item.income.inReais,
      expense: item.expense.inReais,
    }));
  }
}

export default interface IExtractTransactionSummaryUseCase
  extends UseCase<
    ExtractTransactionSummaryParam,
    ExtractTransactionSummaryResponse
  > {}
