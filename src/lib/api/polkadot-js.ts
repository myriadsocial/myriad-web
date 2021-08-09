import {options} from '@acala-network/api';

import {ApiPromise, WsProvider} from '@polkadot/api';

export const connectToBlockchain = async (wsProvider: string): Promise<ApiPromise> => {
  const provider = new WsProvider(wsProvider);
  const api: ApiPromise = new ApiPromise(options({provider}));
  await api.isReadyOrError;
  return api;
};
