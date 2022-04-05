import {BaseModel} from './base.interface';
import {Network} from './network';

export type CurrencyProps = {
  image: string;
  decimal: number;
  native: boolean;
  name: string;
  symbol: CurrencyId;
  referenceId?: string;
  exchangeRate?: boolean;
  networkId: string;
};

//TODO: rename CurrencyId to CurrencySymbol
export enum CurrencyId {
  AUSD = 'AUSD',
  ACA = 'ACA',
  DOT = 'DOT',
  MYRIA = 'MYRIA',
  NEAR = 'NEAR',
  KUSAMA = 'KSM',
  ROC = 'ROC',
}

export type Currency = CurrencyProps &
  Omit<BaseModel, 'id'> & {
    id: string;
    network: Network;
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
