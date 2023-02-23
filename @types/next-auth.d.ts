/* eslint-disable @typescript-eslint/no-unused-vars */
import { Session, User } from 'next-auth';

import { NetworkIdEnum } from 'src/interfaces/network';
import { BlockchainPlatform, WalletTypeEnum } from 'src/interfaces/wallet';

declare module 'next-auth' {
  interface User {
    // User detail
    username: string;
    address: string;

    // Login detail
    token: string;
    instanceURL: string;
    loginType: string;

    // Blockchain detail
    walletType?: WalletTypeEnum;
    networkType?: NetworkIdEnum;
    blockchainPlatform?: BlockchainPlatform;
  }

  interface Session {
    user?: User;
    expires: ISODateString;
  }
}
