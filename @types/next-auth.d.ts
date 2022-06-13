/* eslint-disable @typescript-eslint/no-unused-vars */
import {Session, User} from 'next-auth';

import {NetworkIdEnum} from 'src/interfaces/network';
import {WalletTypeEnum} from 'src/interfaces/wallet';

declare module 'next-auth' {
  interface User {
    name: string;
    anonymous: boolean;
    address: string;
    token: string;
    nonce: number;
  }

  interface Session {
    user?: User;
    expires: ISODateString;
  }
}
