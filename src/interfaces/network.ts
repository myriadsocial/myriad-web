import {BaseModel} from './base.interface';
import {Currency} from './currency';
import {WalletType} from './wallet';

export type NetworkProps = {
  chainId?: number;
  image: string;
  rpcURL: string;
  explorerURL: string;
  types?: string;
  walletType: WalletType;
};

export type Network = NetworkProps &
  BaseModel & {
    currencies: Currency[];
  };
