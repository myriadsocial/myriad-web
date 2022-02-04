import {Currency} from './currency';

export type BalanceDetail = Omit<Currency, 'createdAt' | 'updatedAt'> & {
  freeBalance: number;
  originBalance: number;
  previousNonce: number;
  decimal: number;
  image: string;
  rpcURL: string;
  native: boolean;
  explorerURL: null | string;
};
