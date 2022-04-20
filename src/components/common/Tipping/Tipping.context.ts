import {createContext} from 'react';

import {TippingOptions} from './Tipping.interface';

import {WalletTypeEnum} from 'src/lib/api/ext-auth';

export type HandleSendTip = (options: TippingOptions) => void;

export type HandleTipping = {
  currentWallet?: WalletTypeEnum;
  enabled: boolean;
  send: HandleSendTip;
};

export default createContext<HandleTipping>({
  enabled: false,
  send: console.log,
});
