/* eslint-disable @typescript-eslint/no-unused-vars */
import {Session, User} from 'next-auth';

import {NetworkIdEnum} from 'src/interfaces/network';
import {WalletTypeEnum} from 'src/interfaces/wallet';

declare module 'next-auth' {
  interface User {
    token: string;
    address: string;
    instanceURL: string;
    loginType: string;
  }

  interface Session {
    user?: User;
    expires: ISODateString;
  }
}
