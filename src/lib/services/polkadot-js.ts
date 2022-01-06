import {options} from '@acala-network/api';
import * as Sentry from '@sentry/nextjs';

import {ApiPromise, WsProvider} from '@polkadot/api';
import {Keyring} from '@polkadot/keyring';

import BN from 'bn.js';
import {BalanceDetail} from 'src/interfaces/balance';

interface signAndSendExtrinsicProps {
  from: string;
  to: string;
  value: number;
  currencyId: string;
  wsAddress: string;
  native: boolean;
}

interface SignTransactionCallbackProps {
  apiConnected?: boolean;
  signerOpened?: boolean;
}

interface EstimateFeeResponseProps {
  partialFee: string | null;
  api: ApiPromise | null;
}

export const connectToBlockchain = async (wsProvider: string): Promise<ApiPromise> => {
  const provider = new WsProvider(wsProvider);
  const api: ApiPromise = new ApiPromise(options({provider}));
  await api.isReadyOrError;
  return api;
};

export const estimateFee = async (
  from: string,
  to: string,
  selectedCurrency: BalanceDetail,
): Promise<EstimateFeeResponseProps> => {
  try {
    const {enableExtension} = await import('src/helpers/extension');

    const allAccounts = await enableExtension();

    const keyring = new Keyring();

    const baseAddress = keyring.encodeAddress(from);

    let partialFee: string | null = null;

    let api: ApiPromise | null = null;

    if (allAccounts) {
      // We select the first account matching baseAddress
      // `account` is of type InjectedAccountWithMeta
      const account = allAccounts.find(account => {
        // address from session must match address on polkadot extension
        return account.address === baseAddress;
      });

      // if account has not yet been imported to Polkadot.js extension
      if (!account) {
        throw {
          Error: 'Please import your account first!',
        };
      }

      // otherwise if account found
      if (account) {
        api = await connectToBlockchain(selectedCurrency.rpcURL);

        if (api) {
          const RAND_AMOUNT = 123;

          const info = selectedCurrency.image
            ? await api.tx.balances.transfer(to, RAND_AMOUNT).paymentInfo(from)
            : await api.tx.currencies
                .transfer(to, {TOKEN: selectedCurrency.id}, RAND_AMOUNT)
                .paymentInfo(from);

          if (info) partialFee = info.partialFee.toHuman();
        }
      }
    }
    return {
      partialFee,
      api,
    };
  } catch (error) {
    console.log(error);
    Sentry.captureException(error);
    return error;
  }
};

export const signAndSendExtrinsic = async (
  {from, to, value, currencyId, wsAddress, native}: signAndSendExtrinsicProps,
  callback?: (param: SignTransactionCallbackProps) => void,
): Promise<string | null> => {
  try {
    const {enableExtension} = await import('src/helpers/extension');
    const {web3FromSource} = await import('@polkadot/extension-dapp');

    const allAccounts = await enableExtension();

    const keyring = new Keyring();

    const baseAddress = keyring.encodeAddress(from);

    if (allAccounts) {
      // We select the first account matching baseAddress
      // `account` is of type InjectedAccountWithMeta
      const account = allAccounts.find(account => {
        // address from session must match address on polkadot extension
        return account.address === baseAddress;
      });

      // if account has not yet been imported to Polkadot.js extension
      if (!account) {
        throw {
          Error: 'Please import your account first!',
        };
      }

      // otherwise if account found
      if (account) {
        const api = await connectToBlockchain(wsAddress);

        callback &&
          callback({
            apiConnected: true,
          });
        if (api) {
          // here we use the api to create a balance transfer to some account of a value of 12345678
          const transferExtrinsic = native
            ? api.tx.balances.transfer(to, new BN(value.toString()))
            : api.tx.currencies.transfer(to, {TOKEN: currencyId}, value);

          // to be able to retrieve the signer interface from this account
          // we can use web3FromSource which will return an InjectedExtension type
          const injector = await web3FromSource(account.meta.source);

          callback &&
            callback({
              apiConnected: true,
              signerOpened: true,
            });

          if (transferExtrinsic) {
            // passing the injected account address as the first argument of signAndSend
            // will allow the api to retrieve the signer and the user will see the extension
            // popup asking to sign the balance transfer transaction
            const txInfo = await transferExtrinsic.signAndSend(from, {
              signer: injector.signer,
              // make sure nonce does not stuck
              nonce: -1,
            });

            if (txInfo) {
              return txInfo.toHex();
            }

            await api.disconnect();
          }
        }
      }
    }

    // return null if no txHash is produced
    return null;
  } catch (error) {
    console.log(error);
    Sentry.captureException(error);
    return error;
  }
};
