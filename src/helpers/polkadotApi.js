// This is where polkadot API functions live,
// if you want to perform any function, you should import it from here
// Don't know how to use the API? Visit https://polkadot.js.org/docs/api/start/basics
//import { BalanceDetail } from 'src/interfaces/balance'
import { options } from '@acala-network/api';

import { ApiPromise, WsProvider } from '@polkadot/api';

export const connectToBlockchain = async provider => {
  try {
    //const { typesBundleForPolkadot } = await import('@acala-network/type-definitions');
    const providerTwo = new WsProvider('wss://acala-mandala.api.onfinality.io/public-ws');
    //const providerTwo = new WsProvider('wss://node-6684611760525328384.rz.onfinality.io/ws');
    console.log('the wsProvider: ', providerTwo);
    const api = new ApiPromise(
      options({
        providerTwo
      })
    );
    await api.isReadyOrError;
    console.log('the api is: ', api);

    //TODO:
    // which rpc address for dev and which one is for staging??
    //const wsProvider = new WsProvider(process.env.NEXT_PUBLIC_RPC_ADDRESS_TESTNET);
    //const wsProvider = new WsProvider(provider);
    //console.log('the wsProvider: ', wsProvider);
    //const api = await ApiPromise.create({
    //provider: wsProvider,
    //typesBundle: {
    //spec: {
    //mandala: typesBundleForPolkadot.spec.mandala.types
    //}
    //}
    //}).isReadyOrError;
    //console.log('the api is: ', api);
    return api;
  } catch (error) {
    console.log('error from connectToBlockchain: ', error);
  }
};

export const getBalance = async (ADDR, wsProvider) => {
  try {
    if (ADDR) {
      const DECIMAL_PLACES = 10000000000;
      const api = await connectToBlockchain(wsProvider);

      let balanceDetail = {};

      //get chain info
      //for Polkadot this would print
      //{ss58Format: 0, tokenDecimals: [10], tokenSymbol: [DOT]}
      const chainInfo = api.registry.getChainProperties();
      console.log(chainInfo);
      const {
        data: { free: previousFree }
      } = await api.query.system.account(ADDR);

      balanceDetail = {
        tokenSymbol: chainInfo.tokenSymbol[0],
        tokenDecimals: chainInfo.tokenDecimals[0],
        freeBalance: Number(Number(previousFree) / DECIMAL_PLACES.toFixed(3))
      };
      console.log('the balance detail: ', balanceDetail);
      return balanceDetail;
      //return Number(Number(previousFree) / DECIMAL_PLACES.toFixed(3));
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
