export const connectToBlockchain = async () => {
  const { ApiPromise, WsProvider } = await import('@polkadot/api');
  const wsProvider = new WsProvider('wss://rpc.myriad.systems/');
  const api = await ApiPromise.create({
    provider: wsProvider
    //types: types
  });
  return api;
};

export const getBalance = async () => {
  const DECIMAL_PLACES = 10000000000;
  const ADDR = '5CS8upU5c44NaPu7qiSXGwna7oeDGG3vifM5nZAbwx3nTGTm';
  const api = await connectToBlockchain();
  const {
    data: { free: previousFree }
  } = await api.query.system.account(ADDR);
  return (Number(previousFree) / DECIMAL_PLACES).toFixed(3);
};
