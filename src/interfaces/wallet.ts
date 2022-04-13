import {BaseModel} from './base.interface';
import {Currency} from './currency';

import {TipResult} from 'src/lib/services/polkadot-js';

export enum ContentType {
  COMMENT = 'comment',
  POST = 'post',
}

export enum WalletReferenceType {
  USER = 'user',
  PEOPLE = 'people',
  WALLET_ADDRESS = 'wallet_address',
}

export interface WalletDetail {
  referenceId: string;
  referenceType: WalletReferenceType;
  serverId?: string;
  ftIdentifier?: string;
}

export enum WalletType {
  ETH = 'eth',
  NEAR = 'near',
  POLKADOT = 'polkadot',
}

export interface Network extends BaseModel {
  image: string;
  rpcURL: string;
  explorerURL: string;
  walletType: string;
  currencies?: Currency[];
  tips: TipResult[] | [];
}
