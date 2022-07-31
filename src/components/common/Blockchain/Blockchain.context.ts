import {createContext} from 'react';

import {IProvider} from 'src/interfaces/blockchain-interface';
import {Network} from 'src/interfaces/network';

export type HandleSwitchNetwork = (network: Network) => void;

export type HandleBlockchain = {
  provider: IProvider;
  loadingBlockchain: boolean;
  loadingSwitch: boolean;
  switchNetwork: HandleSwitchNetwork;
};

export default createContext<HandleBlockchain>({
  provider: null,
  loadingBlockchain: true,
  loadingSwitch: true,
  switchNetwork: console.log,
});
