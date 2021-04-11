export const connectToBlockchain = async () => {
  const { ApiPromise, WsProvider } = await import('@polkadot/api');
  const wsProvider = new WsProvider('wss://rpc.myriad.systems/');
  const api = await ApiPromise.create({
    provider: wsProvider
    //types: types
  });
  return api;
};
