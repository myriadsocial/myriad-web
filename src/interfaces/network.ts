import {BaseModel} from './base.interface';
import {Currency} from './currency';
import {BlockchainPlatform} from './wallet';

export interface TipBalanceInfo {
  serverId: string;
  referenceType: string;
  referenceId: string;
  ftIdentifier: string;
}
export interface TipResult {
  tipsBalanceInfo: TipBalanceInfo;
  accountId: string;
  amount: string;
  symbol: string;
  imageURL: string;
}

export enum NetworkIdEnum {
  ETHEREUM = 'ethereum',
  POLKADOT = 'polkadot',
  BINANCE = 'binance',
  POLYGON = 'polygon',
  NEAR = 'near',
  MYRIAD = 'myriad',
  KUSAMA = 'kusama',
}

export type NetworkProps = {
  chainId?: string;
  image: string;
  rpcURL: string;
  explorerURL: string;
  blockchainPlatform: BlockchainPlatform;
  walletURL?: string;
  helperURL?: string;
};

export type Network = NetworkProps &
  BaseModel & {
    id: NetworkIdEnum;
    currencies: Currency[];
    tips: TipResult[];
  };
