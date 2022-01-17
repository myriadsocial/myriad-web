import {BaseModel} from './base.interface';

export type CurrencyProps = {
  image: string;
  decimal: number;
  rpcURL: string;
  native: boolean;
};

export enum CurrencyId {
  AUSD = 'AUSD',
  ACA = 'ACA',
  DOT = 'DOT',
  MYRIA = 'MYRIA',
}

export interface Currency extends CurrencyProps, Omit<BaseModel, 'id'> {
  id: CurrencyId;
}

export interface UserCurrency extends BaseModel {
  priority: number;
  userId: string;
  currencyId: string;
  currency?: Currency;
}
