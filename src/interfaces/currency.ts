import {BaseModel} from './base.interface';

export type CurrencyProps = {
  name: string;
  image: string;
  decimal: number;
  addressType: number;
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
