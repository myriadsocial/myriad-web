import {BaseModel} from './base.interface';

import {Currency, CurrencyId} from 'src/interfaces/currency';
import {Post} from 'src/interfaces/post';
import {User} from 'src/interfaces/user';
import {ContentType} from 'src/interfaces/wallet';

export type TransactionProps = {
  hash: string;
  amount: number;
  type: ContentType;
  referenceId: string;
  from: string;
  to: string;
  currencyId: string;
};

export interface Transaction extends TransactionProps, BaseModel {
  fromUser: User;
  toUser: User;
  post?: Post;
  currency: Currency;
}
export interface TransactionDetail {
  currencyId: CurrencyId;
  amount: number;
}
