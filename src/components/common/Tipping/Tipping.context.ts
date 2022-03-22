import {createContext} from 'react';

import {TippingOptions} from './Tipping.interface';

export type HandleSendTip = (options: TippingOptions) => void;

export type HandleTipping = {
  enabled: boolean;
  send: HandleSendTip;
};

export default createContext<HandleTipping>({
  enabled: false,
  send: console.log,
});
