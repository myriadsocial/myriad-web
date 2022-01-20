import {Currency} from './currency';

export type BalanceDetail = Omit<Currency, 'createdAt' | 'updatedAt'> & {
  freeBalance: number;
  previousNonce: number;
};
