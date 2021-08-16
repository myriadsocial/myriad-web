import {BaseModel} from './base.interface';

import {Currency} from 'src/interfaces/currency';
import {Post} from 'src/interfaces/post';
import {User} from 'src/interfaces/user';

export type TransactionProps = {
  hash: string;
  amount: number;
  from: string;
  to: string;
  postId: string;
  currencyId: string;
};

export interface Transaction extends TransactionProps, BaseModel {
  fromUser: User;
  toUser: User;
  post?: Post;
  //TODO: change later when implementing currency
  currency: Currency;
}

export type TransactionSummary = {
  currencyId: string;
  amount: number;
};
