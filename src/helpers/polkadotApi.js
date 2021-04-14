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

// snippets to send transaction
// finds an injector for an address
export const sendTip = async (toAddress, amountSent) => {
  const { enableExtension } = await import('../helpers/extension');
  const { web3FromSource } = await import('@polkadot/extension-dapp');
  const allAccounts = await enableExtension();
  // We arbitraily select the first account returned from the above snippet
  // `account` is of type InjectedAccountWithMeta
  const account = allAccounts[0];

  const api = await connectToBlockchain();

  //const ALICE = 'tkTptH5puVHn8VJ8NWMdsLa2fYGfYqV8QTyPRZRiQxAHBbCB4';

  //const RIZ_MYR = '5DJUPpC7C8CxiQ5ECNXQ8PR9ngydZ4hiDpHnMivgnC8yfYjc';

  // here we use the api to create a balance transfer to some account of a value of 12345678
  const transferExtrinsic = api.tx.balances.transfer(toAddress, amountSent);

  // to be able to retrieve the signer interface from this account
  // we can use web3FromSource which will return an InjectedExtension type
  const injector = await web3FromSource(account.meta.source);

  // passing the injected account address as the first argument of signAndSend
  // will allow the api to retrieve the signer and the user will see the extension
  // popup asking to sign the balance transfer transaction
  const txInfo = await transferExtrinsic.signAndSend(account.address, { signer: injector.signer });

  return { txHash: txInfo.toHex(), from: account.address };
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
