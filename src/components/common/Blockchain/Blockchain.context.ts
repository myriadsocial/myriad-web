import {createContext} from 'react';

import {IProvider} from 'src/interfaces/blockchain-interface';
import {Network} from 'src/interfaces/network';
import {Server} from 'src/lib/api/server';
import {Near} from 'src/lib/services/near-api-js';

export type HandleSwitchNetwork = (network: Network) => void;

export type HandleBlockchain = {
  server: Server;
  provider: IProvider;
  nearProvider: Near;
  loadingBlockchain: boolean;
  loadingSwitch: boolean;
  switchNetwork: HandleSwitchNetwork;
};

export default createContext<HandleBlockchain>({
  server: null,
  provider: null,
  nearProvider: null,
  loadingBlockchain: true,
  loadingSwitch: true,
  switchNetwork: console.log,
});
