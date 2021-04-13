// This is where polkadot API functions live,
// if you want to perform any function, you should import it from here
// Don't know how to use the API? Visit https://polkadot.js.org/docs/api/start/basics

export const connectToBlockchain = async () => {
  const { ApiPromise, WsProvider } = await import('@polkadot/api');
  const wsProvider = new WsProvider('wss://rpc.myriad.systems/');
  const api = await ApiPromise.create({
    provider: wsProvider
    //types: types
  });
  return api;
};

export const getBalance = async ADDR => {
  const DECIMAL_PLACES = 10000000000;
  //const ADDR = '5CS8upU5c44NaPu7qiSXGwna7oeDGG3vifM5nZAbwx3nTGTm';
  const api = await connectToBlockchain();
  const {
    data: { free: previousFree }
  } = await api.query.system.account(ADDR);
  return Number(Number(previousFree) / DECIMAL_PLACES.toFixed(3));
};

export const getWalletHistory = async () => {
  const api = await connectToBlockchain();
  //Subscribe to system events via storage
  api.query.system.events(events => {
    console.log(`\nReceived ${events.length} events:`);

    //Loop through the Vec<EventRecord>
    events.forEach(record => {
      //Extract the phase, event and the event types
      const { event, phase } = record;
      const types = event.typeDef;

      //Show what we are busy with
      console.log(`\t${event.section}:${event.method}:: (phase=${phase.toString()})`);
      console.log(`\t\t${event.meta.documentation.toString()}`);

      //Loop through each of the parameters, displaying the type and data
      event.data.forEach((data, index) => {
        console.log(`\t\t\t${types[index].type}: ${data.toString()}`);
      });
    });
  });
};
