import {BaseModel} from './base.interface';
import {Currency} from './currency';
import {BlockchainPlatform} from './wallet';

export const CURRENT_NETWORK_KEY = '@Current_Network_Key';

export enum NetworkIdEnum {
  ETHEREUM = 'ethereum',
  POLKADOT = 'polkadot',
  BINANCE = 'binance',
  POLYGON = 'polygon',
  NEAR = 'near',
  MYRIAD = 'myriad',
  KUSAMA = 'kusama',
  DEBIO = 'debio',
}

export type NetworkProps = {
  chainId?: string;
  image: string;
  rpcURL: string;
  explorerURL: string;
  blockchainPlatform: BlockchainPlatform;
  currencySymbol: string;
  walletURL?: string;
  additionalWalletURL?: string;
  helperURL?: string;
};

export type CurrencyWithTips = Currency & {
  accountId: string | null;
  amount: string | null;
};

export type Network = NetworkProps &
  BaseModel & {
    id: NetworkIdEnum;
    currencies?: CurrencyWithTips[];
    isUserHasTip?: boolean;
    hasToClaimed?: boolean;
  };
