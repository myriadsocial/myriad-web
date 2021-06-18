import { options } from '@acala-network/api';

import { useState } from 'react';

import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';

import { useBalance as baseUseBalance, BalanceActionType } from '../components/wallet/balance.context';

import { updateTips } from 'src/lib/api/post';

type Props = {
  fromAddress: string;
  toAddress: string;
  amountSent: number;
  currencyId: string;
  postId: string;
};

interface SendTipResponseProps {
  from?: string;
  trxHash?: string;
}

const formatNumber = (number: number, decimals: number) => {
  if (number.toString() === '0') return '0';
  const result = Number((Number(number.toString()) / 10 ** decimals).toFixed(5));
  return result;
};

// params mungkin butuh address sama tipe wsProvider
export const usePolkadotApi = () => {
  const { state, dispatch } = baseUseBalance();

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
      return;
    } finally {
      setLoading(false);
    }
  };

  const load = async (address: string) => {
    setLoading(true);

    try {
      const provider = new WsProvider(process.env.NEXT_PUBLIC_ACALA_TESTNET);
      const api = new ApiPromise(options({ provider }));
      await api.isReady;

      //const accountData = await api.query.system.account(address);
      //setACABalance(accountData.data.free);

      //const tokenData = await api.query.tokens.accounts(address, { TOKEN: 'DOT' });
      //setDotBalance(tokenData?.free);

      const ausdData = await api.query.tokens.accounts(address, { TOKEN: 'AUSD' });

      dispatch({
        type: BalanceActionType.INIT_BALANCE,
        balanceDetails: [
          {
            freeBalance: formatNumber(ausdData?.free as number, 12),
            tokenSymbol: 'AUSD',
            tokenDecimals: 12
          }
          //{
          //freeBalance: formatNumber(accountData.data.free as number, 13),
          //tokenSymbol: 'ACA',
          //tokenDecimals: 13
          //},
          //{
          //freeBalance: formatNumber(tokenData?.free as number, 10),
          //tokenSymbol: 'DOT',
          //tokenDecimals: 10
          //}
        ]
      });
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
<<<<<<< HEAD
  const sendTip = async ({ fromAddress, toAddress, amountSent, currencyId, postId }: Props) => {
=======
  const formattedDOT = () => {
    if (!dotBalance) return '0';
    return formatNumber(dotBalance, 10);
  };

  const formattedACA = () => {
    if (!acaBalance) return '0';
    return formatNumber(acaBalance, 13);
  };

  const sendTip = async (fromAddress, toAddress, amountSent, currencyId, postId) => {
>>>>>>> d0f6fbf (handled rebase conflicts with dev branch)
=======
  const sendTip = async ({ fromAddress, toAddress, amountSent, currencyId, postId }: Props) => {
>>>>>>> c5917f4 (revised send tips coding flow, todos must be done)
    setLoading(true);
    try {
      const { enableExtension } = await import('../helpers/extension');
      const { web3FromSource } = await import('@polkadot/extension-dapp');

      const allAccounts = await enableExtension();
      // We select the first account found by using fromAddress
      // `account` is of type InjectedAccountWithMeta
      const keyring = new Keyring();
      const account = allAccounts?.find(function (account) {
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
        const transferExtrinsic =
          currencyId === 'ACA'
<<<<<<< HEAD
<<<<<<< HEAD
            ? api?.tx.balances.transfer(toAddress, amountSent)
            : api?.tx.currencies.transfer(toAddress, { TOKEN: currencyId }, amountSent);
=======
            ? api.tx.balances.transfer(toAddress, amountSent)
            : api.tx.currencies.transfer(toAddress, { TOKEN: currencyId }, amountSent);
=======
            ? api?.tx.balances.transfer(toAddress, amountSent)
            : api?.tx.currencies.transfer(toAddress, { TOKEN: currencyId }, amountSent);
>>>>>>> c5917f4 (revised send tips coding flow, todos must be done)

<<<<<<< HEAD
        console.log('transferExtrinsic: ', transferExtrinsic);
>>>>>>> d0f6fbf (handled rebase conflicts with dev branch)

=======
>>>>>>> 29f1f40 (handled undefined error on balanceDetails object)
        // to be able to retrieve the signer interface from this account
        // we can use web3FromSource which will return an InjectedExtension type
        const injector = await web3FromSource(account.meta.source);

        // passing the injected account address as the first argument of signAndSend
        // will allow the api to retrieve the signer and the user will see the extension
        // popup asking to sign the balance transfer transaction
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> c5917f4 (revised send tips coding flow, todos must be done)
        const txInfo = await transferExtrinsic?.signAndSend(fromAddress, { signer: injector.signer });

<<<<<<< HEAD
        const transactionRecord = updateTips(currencyId, amountSent, postId);
        console.log('the transaction record is: ', transactionRecord);
<<<<<<< HEAD

        if (!txInfo) {
          throw {
            Error: 'Something is wrong, please try again later!'
          };
        }
=======
        console.log('txInfo: ', txInfo);
        console.log('the currencyId is: ', currencyId);

        const response = updateTips(amountSent, postId);
        console.log('response is:', response);
>>>>>>> d0f6fbf (handled rebase conflicts with dev branch)
=======
        const txInfo = await transferExtrinsic.signAndSend(fromAddress, { signer: injector.signer });

        const response = updateTips(amountSent, postId);
>>>>>>> 29f1f40 (handled undefined error on balanceDetails object)

        //TODO: move trxHash to dispatch
=======

        if (!txInfo) {
          throw {
            Error: 'Something is wrong, please try again later!'
          };
        }

        dispatch;
>>>>>>> c5917f4 (revised send tips coding flow, todos must be done)
        const response = {
          trxHash: txInfo?.toHex()
        };
        return response;
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    load,
    tokens: state.balanceDetails,
    sendTip
  };
};
