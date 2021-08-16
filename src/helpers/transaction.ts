import {Token} from 'src/interfaces/token';
import {TransactionSummary} from 'src/interfaces/transaction';
import {Transaction} from 'src/interfaces/transaction';

const UNKNOWN_ACCOUNT = 'unknown';

const formatBalance = (value: number, decimals: number): number => {
  if (value.toString() === '0') return 0;

  const result = Number((Number(value.toString()) / 10 ** decimals).toFixed(5));

  return result;
};

export const formatTipBalance = (tip: TransactionSummary, tokens: Token[]): number => {
  const token = tokens.find(item => item.id === tip.currencyId);

  if (!token) return tip.amount;

  return formatBalance(tip.amount, token.token_decimal);
};

export const formatTransactionBalance = (transaction: Transaction, tokens: Token[]): number => {
  const token = tokens.find(item => item.id === transaction.currencyId);

  if (!token) return transaction.amount;

  return formatBalance(transaction.amount, token.token_decimal);
};

export const getTipperUserName = (transaction: Transaction): string => {
  if (transaction.from === UNKNOWN_ACCOUNT || !transaction.fromUser) {
    return 'Anonymous user';
  }

  return transaction.fromUser.name;
};
