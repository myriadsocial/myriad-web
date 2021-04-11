export const connectToBlockchain = async () => {
  const { ApiPromise, WsProvider } = await import('@@polkadot/api');
  const wsProvider = new WsProvider('wss://rpc.myriad.systems/');
  console.log('wsProvider:', wsProvider);
  console.log('the ApiPromise', ApiPromise);
  const api = await ApiPromise.create({
    provider: wsProvider
    //types: types
  });
  return api;
};
