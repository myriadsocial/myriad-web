import {options} from '@acala-network/api';
import * as Sentry from '@sentry/nextjs';

import {ApiPromise, WsProvider} from '@polkadot/api';
import {Keyring} from '@polkadot/keyring';

export const connectToBlockchain = async (wsProvider: string): Promise<ApiPromise> => {
  const provider = new WsProvider(wsProvider);
  const api: ApiPromise = new ApiPromise(options({provider}));
  await api.isReadyOrError;
  return api;
};

interface signAndSendExtrinsicProps {
  from: string;
  to: string;
  value: number;
  currencyId: string;
  wsAddress: string;
}

interface SignTransactionCallbackProps {
  apiConnected?: boolean;
  signerOpened?: boolean;
}

export const signAndSendExtrinsic = async (
  {from, to, value, currencyId, wsAddress}: signAndSendExtrinsicProps,
  callback?: (param: SignTransactionCallbackProps) => void,
): Promise<string | null> => {
  try {
    const {enableExtension} = await import('../../helpers/extension');
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
          const transferExtrinsic =
            // Unable to create extrinsic here for MYRIA
            currencyId === 'ACA'
              ? api.tx.balances.transfer(to, value)
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
    Sentry.captureException(error);
    return error;
  }
};
