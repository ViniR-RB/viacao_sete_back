import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import ServiceException from '@/core/exceptions/service.exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import { Amount } from '@/core/value-objects/amount';
import ITransactionRepository, {
  TransactionPeriod,
} from '@/modules/transactions/adapters/i_transaction.repository';
import TransactionEntity from '@/modules/transactions/domain/entities/transaction.entity';
import {
  BreakdownSummary,
  DailyTransactionSummary,
  MonthlyTransactionSummary,
} from '@/modules/transactions/domain/entities/transaction_breakdown';
import { TransactionType } from '@/modules/transactions/domain/types/transaction-type';
import IExtractTransactionSummaryUseCase, {
  ExtractPeriod,
  ExtractTransactionSummaryParam,
  ExtractTransactionSummaryResponse,
} from '@/modules/transactions/domain/usecase/i_extract_transaction_summary_use_case';

export default class ExtractTransactionSummaryService
  implements IExtractTransactionSummaryUseCase
{
  constructor(private readonly transactionRepository: ITransactionRepository) {}

  async execute(
    param: ExtractTransactionSummaryParam,
  ): AsyncResult<AppException, ExtractTransactionSummaryResponse> {
    try {
      // Map ExtractPeriod to TransactionPeriod
      const repositoryPeriod = this.mapPeriod(param.period);

      // Query transactions from repository using period
      const transactionsResult = await this.transactionRepository.findByPeriod({
        period: repositoryPeriod,
      });

      if (transactionsResult.isLeft()) {
        return left(transactionsResult.value);
      }

      const transactions = transactionsResult.value;

      // Aggregate transactions by type and period
      const { incomeTotal, expenseTotal, startDate, endDate, breakdown } =
        this.aggregateTransactions(transactions, param.period);

      // Calculate net total
      const netTotal = incomeTotal.subtract(expenseTotal);

      // Return summary
      const response = new ExtractTransactionSummaryResponse(
        incomeTotal,
        expenseTotal,
        netTotal,
        param.period,
        startDate,
        endDate,
        breakdown,
      );

      return right(response);
    } catch (error) {
      if (error instanceof AppException) {
        return left(error);
      }
      return left(
        new ServiceException(ErrorMessages.UNEXPECTED_ERROR, 500, error),
      );
    }
  }

  /**
   * Map ExtractPeriod to TransactionPeriod
   */
  private mapPeriod(period: ExtractPeriod): TransactionPeriod {
    if (period === ExtractPeriod.TWELVE_MONTHS) {
      return TransactionPeriod.TWELVE_MONTHS;
    } else if (period === ExtractPeriod.LAST_30_DAYS) {
      return TransactionPeriod.LAST_30_DAYS;
    }
    return TransactionPeriod.LAST_30_DAYS;
  }

  /**
   * Calculate date boundaries for response (same logic as repository for consistency)
   */
  private getDateBoundaries(period: ExtractPeriod): {
    startDate: Date;
    endDate: Date;
  } {
    const today = new Date();

    if (period === ExtractPeriod.TWELVE_MONTHS) {
      // End date: last day of current month
      const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      endDate.setHours(23, 59, 59, 999);

      // Start date: 1st day of 12 months ago
      const startDate = new Date(today.getFullYear() - 1, today.getMonth(), 1);
      startDate.setHours(0, 0, 0, 0);

      return { startDate, endDate };
    } else {
      // LAST_30_DAYS
      const endDate = new Date(today);
      endDate.setHours(23, 59, 59, 999);

      const startDate = new Date(today);
      startDate.setDate(startDate.getDate() - 30);
      startDate.setHours(0, 0, 0, 0);

      return { startDate, endDate };
    }
  }

  /**
   * Aggregate transactions by type (INCOME vs EXPENSE) and period
   * LAST_30_DAYS: breakdown by day
   * TWELVE_MONTHS: breakdown by month
   */
  private aggregateTransactions(
    transactions: TransactionEntity[],
    period: ExtractPeriod,
  ): {
    incomeTotal: Amount;
    expenseTotal: Amount;
    startDate: Date;
    endDate: Date;
    breakdown: BreakdownSummary;
  } {
    let incomeTotal = Amount.fromReais(0);
    let expenseTotal = Amount.fromReais(0);

    // Initialize breakdown maps
    const dailyMap = new Map<string, DailyTransactionSummary>();
    const monthlyMap = new Map<string, MonthlyTransactionSummary>();

    for (const transaction of transactions) {
      const amount = transaction.amount;

      if (transaction.type === TransactionType.INCOME) {
        incomeTotal = incomeTotal.add(amount);
      } else if (transaction.type === TransactionType.EXPENSE) {
        expenseTotal = expenseTotal.add(amount);
      }

      // Build breakdown based on period
      if (period === ExtractPeriod.LAST_30_DAYS) {
        const dayKey = this.formatDate(transaction.createdAt);
        const existing = dailyMap.get(dayKey);

        if (existing) {
          if (transaction.type === TransactionType.INCOME) {
            existing.income = existing.income.add(amount);
          } else {
            existing.expense = existing.expense.add(amount);
          }
        } else {
          const income =
            transaction.type === TransactionType.INCOME
              ? amount
              : Amount.fromReais(0);
          const expense =
            transaction.type === TransactionType.EXPENSE
              ? amount
              : Amount.fromReais(0);
          dailyMap.set(dayKey, { day: dayKey, income, expense });
        }
      } else if (period === ExtractPeriod.TWELVE_MONTHS) {
        const monthKey = this.formatMonth(transaction.createdAt);
        const existing = monthlyMap.get(monthKey);

        if (existing) {
          if (transaction.type === TransactionType.INCOME) {
            existing.income = existing.income.add(amount);
          } else {
            existing.expense = existing.expense.add(amount);
          }
        } else {
          const income =
            transaction.type === TransactionType.INCOME
              ? amount
              : Amount.fromReais(0);
          const expense =
            transaction.type === TransactionType.EXPENSE
              ? amount
              : Amount.fromReais(0);
          monthlyMap.set(monthKey, { month: monthKey, income, expense });
        }
      }
    }

    const { startDate, endDate } = this.getDateBoundaries(period);

    // Convert maps to sorted arrays and fill missing dates/months
    let breakdown: BreakdownSummary;

    if (period === ExtractPeriod.LAST_30_DAYS) {
      // Fill all 30 days
      const fullDailyMap = this.fillMissingDays(dailyMap, startDate, endDate);
      breakdown = Array.from(fullDailyMap.values()).sort((a, b) =>
        a.day.localeCompare(b.day),
      );
    } else {
      // Fill all 12 months
      const fullMonthlyMap = this.fillMissingMonths(
        monthlyMap,
        startDate,
        endDate,
      );
      breakdown = Array.from(fullMonthlyMap.values()).sort((a, b) =>
        a.month.localeCompare(b.month),
      );
    }

    return { incomeTotal, expenseTotal, startDate, endDate, breakdown };
  }

  /**
   * Fill missing days with zero values
   */
  private fillMissingDays(
    dailyMap: Map<string, DailyTransactionSummary>,
    startDate: Date,
    endDate: Date,
  ): Map<string, DailyTransactionSummary> {
    const filledMap = new Map<string, DailyTransactionSummary>(dailyMap);

    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dayKey = this.formatDate(currentDate);
      if (!filledMap.has(dayKey)) {
        filledMap.set(dayKey, {
          day: dayKey,
          income: Amount.fromReais(0),
          expense: Amount.fromReais(0),
        });
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return filledMap;
  }

  /**
   * Fill missing months with zero values
   */
  private fillMissingMonths(
    monthlyMap: Map<string, MonthlyTransactionSummary>,
    startDate: Date,
    endDate: Date,
  ): Map<string, MonthlyTransactionSummary> {
    const filledMap = new Map<string, MonthlyTransactionSummary>(monthlyMap);

    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const monthKey = this.formatMonth(currentDate);
      if (!filledMap.has(monthKey)) {
        filledMap.set(monthKey, {
          month: monthKey,
          income: Amount.fromReais(0),
          expense: Amount.fromReais(0),
        });
      }
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return filledMap;
  }

  /**
   * Format date to YYYY-MM-DD string
   */
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Format date to YYYY-MM string
   */
  private formatMonth(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }
}
