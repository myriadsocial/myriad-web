import {createContext} from 'react';

import {Network} from 'src/interfaces/network';
import {IProvider} from 'src/lib/services/blockchain-interface';

export type HandleSwitchNetwork = (network: Network) => void;

export type HandleBlockchain = {
  provider: IProvider;
  switchNetwork: HandleSwitchNetwork;
};

export default createContext<HandleBlockchain>({
  provider: null,
  switchNetwork: console.log,
});
