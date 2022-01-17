import {Currency} from './currency';

export type BalanceDetail = Currency & {
  freeBalance: number;
  previousNonce: number;
};
