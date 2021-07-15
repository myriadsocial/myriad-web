import { TipsReceived } from 'src/interfaces/post';
import { Token } from 'src/interfaces/token';
import { Transaction } from 'src/interfaces/transaction';

const formatBalance = (value: number, decimals: number): number => {
  if (value.toString() === '0') return 0;

  const result = Number((Number(value.toString()) / 10 ** decimals).toFixed(5));

  return result;
};

export const formatTipBalance = (tip: TipsReceived, tokens: Token[]): number => {
  const token = tokens.find(item => item.id === tip.tokenId);

  if (!token) return tip.totalTips;

  return formatBalance(tip.totalTips, token.token_decimal);
};

export const formatTransactionBalance = (transaction: Transaction, tokens: Token[]): number => {
  const token = tokens.find(item => item.id === transaction.tokenId);

  if (!token) return transaction.value;

  return formatBalance(transaction.value, token.token_decimal);
};
