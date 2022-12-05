import {createContext} from 'react';

import {TippingOptions} from './Tipping.interface';

export type HandleSendTip = (options: TippingOptions) => void;

export type HandleTipping = {
  enabled: boolean;
  loading: boolean;
  send: HandleSendTip;
};

export default createContext<HandleTipping>({
  enabled: false,
  loading: false,
  send: console.log,
});
