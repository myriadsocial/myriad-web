import {BaseModel} from './base.interface';

export type CurrencyProps = {
  image: string;
  decimal: number;
  rpcURL: string;
  native: boolean;
  explorerURL: null | string;
};

export enum CurrencyId {
  AUSD = 'AUSD',
  ACA = 'ACA',
  DOT = 'DOT',
  MYRIA = 'MYRIA',
}

export type Currency = CurrencyProps &
  Omit<BaseModel, 'id'> & {
    id: CurrencyId;
  };

export type UserCurrencyProps = {
  userId: string;
  currencyId: string;
};

export type UserCurrency = UserCurrencyProps &
  BaseModel & {
    priority: number;
    currency?: Currency;
  };
