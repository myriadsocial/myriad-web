import {NetworkIdEnum} from './network';
import {BlockchainPlatform, WalletTypeEnum} from './wallet';

export interface SignInCredential {
  // User detail
  id: string;
  username: string;
  email: string;
  address: string;

  // Login detail
  instanceURL: string;
  loginType: LoginType;

  // Blockchain detail
  walletType?: WalletTypeEnum;
  networkType?: NetworkIdEnum;
  blockchainPlatform?: BlockchainPlatform;
}

export enum LoginType {
  EMAIL = 'email',
  WALLET = 'wallet',
}
