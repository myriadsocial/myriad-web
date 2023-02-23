import { createContext } from 'react';

import { IProvider } from 'src/interfaces/blockchain-interface';
import { Network } from 'src/interfaces/network';
import { Server } from 'src/lib/api/server';

export type HandleSwitchNetwork = (network: Network) => void;

export type HandleSwitchInstance = () => void;

export type HandleBlockchain = {
  server: Server;
  provider: IProvider;
  loadingBlockchain: boolean;
  loadingSwitch: boolean;
  switchNetwork: HandleSwitchNetwork;
  switchInstance: HandleSwitchInstance;
};

export default createContext<HandleBlockchain>({
  server: null,
  provider: null,
  loadingBlockchain: true,
  loadingSwitch: true,
  switchNetwork: console.log,
  switchInstance: console.log,
});
