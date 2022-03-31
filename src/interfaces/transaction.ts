import {BN} from '@polkadot/util';

import {BalanceDetail} from './balance';
import {BaseModel} from './base.interface';

import {Currency, CurrencyId} from 'src/interfaces/currency';
import {Post} from 'src/interfaces/post';
import {UserOnTransaction, WalletWithUser} from 'src/interfaces/user';

export type TransactionProps = {
  hash: string;
  amount: number;
  type?: string;
  referenceId?: string;
  from: string;
  to: string;
  currencyId: string;
};

export type SimpleSendTipProps = {
  from: string;
  to: string;
  type?: string;
  referenceId?: string;
  amount: BN;
  currency: BalanceDetail;
};

// TODO: to be refactored, changed into TransactionHistoryDetail
export interface Transaction extends TransactionProps, BaseModel {
  fromWallet?: WalletWithUser;
  toWallet?: WalletWithUser;
  post?: Post;
  currency: Currency;
}
export interface TransactionDetail {
  currencyId: CurrencyId;
  amount: number;
}

export type TransactionHistoryDetail = {
  id: string;
  hash: string;
  amount: number;
  createdAt: string;
  updatedAt?: string;
  from: UserOnTransaction;
  to: UserOnTransaction;
  currency: Currency;
};

export type TransactionSort = 'highest' | 'latest';
