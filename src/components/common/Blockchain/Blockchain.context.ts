import {createContext} from 'react';

import {IProvider} from 'src/interfaces/blockchain-interface';
import {Network} from 'src/interfaces/network';
import {Near} from 'src/lib/services/near-api-js';

export type HandleSwitchNetwork = (network: Network) => void;

export type HandleBlockchain = {
  provider: IProvider;
  nearProvider: Near;
  loadingBlockchain: boolean;
  loadingSwitch: boolean;
  switchNetwork: HandleSwitchNetwork;
};

export default createContext<HandleBlockchain>({
  provider: null,
  nearProvider: null,
  loadingBlockchain: true,
  loadingSwitch: true,
  switchNetwork: console.log,
});
