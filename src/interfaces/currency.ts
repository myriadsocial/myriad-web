import {BaseModel} from './base.interface';

export type CurrencyProps = {
  name: string;
  image: string;
  decimal: number;
  addressType: number;
  rpcURL: string;
  native: boolean;
};

export interface Currency extends CurrencyProps, BaseModel {}
