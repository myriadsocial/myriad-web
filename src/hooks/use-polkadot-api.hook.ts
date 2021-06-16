//@ts-nocheck
import { options } from '@acala-network/api';

import { useState } from 'react';

import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';

import { useBalance as baseUseBalance, BalanceActionType } from '../components/wallet/balance.context';

import { updateTips } from 'src/lib/api/post';

const formatNumber = (number: number, decimals: string) => {
  if (number.toString() === '0') return '0';
  return (Number(number.toString()) / 10 ** decimals).toFixed(5);
};

// params mungkin butuh address sama tipe wsProvider
export const usePolkadotApi = () => {
  const { state, dispatch } = baseUseBalance();

  const [dotBalance, setDotBalance] = useState();
  const [acaBalance, setACABalance] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const connectToBlockchain = async () => {
    setLoading(true);
    try {
      const provider = new WsProvider(process.env.NEXT_PUBLIC_ACALA_TESTNET);
      const api = new ApiPromise(options({ provider }));
      await api.isReady;
      return api;
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const load = async (address: string) => {
    setLoading(true);

    try {
      console.log('the address is: ', address);
      const provider = new WsProvider(process.env.NEXT_PUBLIC_ACALA_TESTNET);
      const api = new ApiPromise(options({ provider }));
      await api.isReady;

      const accountData = await api.query.system.account(address);
      setACABalance(accountData.data.free);

      const tokenData = await api.query.tokens.accounts(address, { TOKEN: 'DOT' });
      setDotBalance(tokenData?.free);

      const ausdData = await api.query.tokens.accounts(address, { TOKEN: 'AUSD' });
      setDotBalance(ausdData?.free);

      dispatch({
        type: BalanceActionType.INIT_BALANCE,
        balanceDetails: [
          {
            freeBalance: formatNumber(ausdData?.free as number, 12),
            tokenSymbol: 'AUSD'
          },
          {
            freeBalance: formatNumber(accountData.data.free as number, 13),
            tokenSymbol: 'ACA'
          },
          {
            freeBalance: formatNumber(tokenData?.free as number, 10),
            tokenSymbol: 'DOT'
          }
        ]
      });
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const formattedDOT = () => {
    if (!dotBalance) return '0';
    return formatNumber(dotBalance, 10);
  };

  const formattedACA = () => {
    if (!acaBalance) return '0';
    return formatNumber(acaBalance, 13);
  };

  const sendTip = async (fromAddress, toAddress, amountSent, postId) => {
    setLoading(true);
    try {
      const { enableExtension } = await import('../helpers/extension');
      const { web3FromSource } = await import('@polkadot/extension-dapp');

      const allAccounts = await enableExtension();
      // We select the first account found by using fromAddress
      // `account` is of type InjectedAccountWithMeta
      const keyring = new Keyring();
      const account = allAccounts.find(function (account) {
        // address from session must match address on polkadot extension
        return account.address === keyring.encodeAddress(fromAddress, 42);
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

        console.log('the injector: ', injector);

        // passing the injected account address as the first argument of signAndSend
        // will allow the api to retrieve the signer and the user will see the extension
        // popup asking to sign the balance transfer transaction
        const txInfo = await transferExtrinsic.signAndSend(fromAddress, { signer: injector.signer });

        console.log('txInfo: ', txInfo);

        const response = updateTips('ACA', amountSent, postId);
        console.log('response is:', response);

        return { trxHash: txInfo.toHex(), from: fromAddress };
      }
    } catch (error) {
      return error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    load,
    tokens: state.balanceDetails,
    formattedDOT,
    formattedACA,
    sendTip
  };
};
