// This is where polkadot API functions live,
// if you want to perform any function, you should import it from here
// Don't know how to use the API? Visit https://polkadot.js.org/docs/api/start/basics

export const connectToBlockchain = async () => {
  try {
    const { ApiPromise, WsProvider } = await import('@polkadot/api');
    // 'wss://rpc.myriad.systems'
    const wsProvider = new WsProvider(process.env.NEXT_PUBLIC_RPC_ADDRESS_TESTNET);
    const api = await new ApiPromise({
      provider: wsProvider
      //types: types
    }).isReadyOrError;
    return api;
  } catch (error) {
    console.log('error from connectToBlockchain: ', error);
  }
};

export const getBalance = async ADDR => {
  try {
    if (ADDR) {
      const DECIMAL_PLACES = 10000000000;
      const api = await connectToBlockchain();
      const {
        data: { free: previousFree }
      } = await api.query.system.account(ADDR);
      return Number(Number(previousFree) / DECIMAL_PLACES.toFixed(3));
    } else {
      return;
    }
  } catch (error) {
    console.log('error from getBalance: ', error);
  }
};

// snippets to send transaction
// finds an injector for an address
export const sendTip = async (fromAddress, toAddress, amountSent) => {
  try {
    const { enableExtension } = await import('../helpers/extension');
    const { web3FromSource } = await import('@polkadot/extension-dapp');

    const allAccounts = await enableExtension();
    // We select the first account found by using fromAddress
    // `account` is of type InjectedAccountWithMeta
    const account = allAccounts.find(function (account) {
      return account.address === fromAddress;
    });
    // if account has not yet been imported to Polkadot.js extension
    if (account === undefined) {
      throw {
        Error: 'Please import your account first!'
      };
    }
    // otherwise
    if (account) {
      const api = await connectToBlockchain();

      // here we use the api to create a balance transfer to some account of a value of 12345678
      const transferExtrinsic = api.tx.balances.transfer(toAddress, amountSent);

      // to be able to retrieve the signer interface from this account
      // we can use web3FromSource which will return an InjectedExtension type
      const injector = await web3FromSource(account.meta.source);

      // passing the injected account address as the first argument of signAndSend
      // will allow the api to retrieve the signer and the user will see the extension
      // popup asking to sign the balance transfer transaction
      const txInfo = await transferExtrinsic.signAndSend(fromAddress, { signer: injector.signer });

      return { trxHash: txInfo.toHex(), from: fromAddress };
    }
  } catch (error) {
    return error;
  }
};
