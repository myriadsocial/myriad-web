import {BaseModel} from './base.interface';
import {Currency} from './currency';

export enum NetworkTypeEnum {
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
  blockchainPlatform: string;
  walletURL?: string;
  helperURL?: string;
};

export type Network = NetworkProps &
  BaseModel & {
    currencies: Currency[];
  };
