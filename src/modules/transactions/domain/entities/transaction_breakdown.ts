import { Amount } from '@/core/value-objects/amount';

export interface DailyTransactionSummary {
  day: string; // Format: YYYY-MM-DD
  income: Amount;
  expense: Amount;
}

export interface MonthlyTransactionSummary {
  month: string; // Format: YYYY-MM
  income: Amount;
  expense: Amount;
}

export type BreakdownSummary =
  | DailyTransactionSummary[]
  | MonthlyTransactionSummary[];
