import { TransactionCategoryEntityProps } from '@/modules/transactions/domain/entities/transaction-category.entity';
import TransactionCategoryType from '@/modules/transactions/domain/entities/transaction_category_enum';

/**
 * Objeto válido para criar uma categoria comum (compartilhada)
 */
export const VALID_COMMON_TRANSACTION_CATEGORY_PROPS: Omit<
  TransactionCategoryEntityProps,
  'id' | 'createdAt' | 'updatedAt'
> = {
  userId: null,
  name: 'Alimentação',
  description: 'Despesas com alimentação',
  types: [TransactionCategoryType.COMMON],
};

/**
 * Objeto válido para criar uma categoria de agência
 */
export const VALID_AGENCY_TRANSACTION_CATEGORY_PROPS: Omit<
  TransactionCategoryEntityProps,
  'id' | 'createdAt' | 'updatedAt'
> = {
  userId: null,
  name: 'Manutenção Agência Centro',
  description: 'Despesas de manutenção da agência',
  types: [TransactionCategoryType.AGENCY],
};

/**
 * Objeto válido para criar uma categoria de linha
 */
export const VALID_LINE_TRANSACTION_CATEGORY_PROPS: Omit<
  TransactionCategoryEntityProps,
  'id' | 'createdAt' | 'updatedAt'
> = {
  userId: null,
  name: 'Combustível Linha 101',
  description: 'Despesas de combustível',
  types: [TransactionCategoryType.LINE],
};

/**
 * Objeto válido para criar uma categoria que funciona em múltiplos contextos
 */
export const VALID_MULTI_TYPE_TRANSACTION_CATEGORY_PROPS: Omit<
  TransactionCategoryEntityProps,
  'id' | 'createdAt' | 'updatedAt'
> = {
  userId: null,
  name: 'Seguro',
  description: 'Despesas com seguros',
  types: [TransactionCategoryType.AGENCY, TransactionCategoryType.LINE],
};

/**
 * Objeto com userId específico (categoria pessoal do usuário)
 */
export const VALID_USER_TRANSACTION_CATEGORY_PROPS: Omit<
  TransactionCategoryEntityProps,
  'id' | 'createdAt' | 'updatedAt'
> = {
  userId: 123,
  name: 'Categoria do Usuário',
  description: null,
  types: [TransactionCategoryType.COMMON],
};
