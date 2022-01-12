import {options} from '@acala-network/api';
import {Balance, OrmlAccountData} from '@open-web3/orml-types/interfaces';
import * as Sentry from '@sentry/nextjs';

import {ApiPromise, WsProvider} from '@polkadot/api';
import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';
import {Keyring} from '@polkadot/keyring';
import {u128, u32, UInt} from '@polkadot/types';
import {numberToHex} from '@polkadot/util';

import {NoAccountException} from './errors/NoAccountException';

import BN from 'bn.js';
import {BalanceDetail} from 'src/interfaces/balance';
import {Currency, CurrencyId} from 'src/interfaces/currency';

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

type CheckBalanceResult = {
  free: u128 | UInt;
  nonce?: u32;
};

export const connectToBlockchain = async (wsProvider: string): Promise<ApiPromise> => {
  const provider = new WsProvider(wsProvider);
  const api: ApiPromise = new ApiPromise(options({provider}));
  await api.isReadyOrError;
  return api;
};

export const convertAcaBasedTxFee = async (
  api: ApiPromise,
  selectedCurrency: BalanceDetail,
): Promise<number | null> => {
  try {
    const acaBasedTokenPoolInString = (
      await api.query.dex.liquidityPool([{TOKEN: 'ACA'}, {TOKEN: selectedCurrency.id}])
    ).toString();

    const acaBasedTokenPools = acaBasedTokenPoolInString
      .substring(1, acaBasedTokenPoolInString.length - 1)
      .replace(/"/g, '')
      .split(',');

    const acaBasedTokenPool = parseInt(acaBasedTokenPools[1]) / 10 ** selectedCurrency.decimal;
    const acaPool = parseInt(acaBasedTokenPools[0]) / 10 ** 13;
    const tokenPerAca = acaBasedTokenPool / acaPool;
    return tokenPerAca;
  } catch (error) {
    console.log({error});
    return null;
  }
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

    let finalPartialFee: string | null = null;

    let acaBasedTxFee: number | null = null;

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

          const {partialFee} = selectedCurrency.native
            ? await api.tx.balances.transfer(to, RAND_AMOUNT).paymentInfo(from)
            : await api.tx.currencies
                .transfer(to, {TOKEN: selectedCurrency.id}, RAND_AMOUNT)
                .paymentInfo(from);

          if (selectedCurrency.id === CurrencyId.AUSD) {
            const tokenPerAca = await convertAcaBasedTxFee(api, selectedCurrency);
            acaBasedTxFee = Number(partialFee.toString()) / 10 ** 13;
            if (tokenPerAca) {
              finalPartialFee = (acaBasedTxFee * tokenPerAca).toString();
            }
          } else {
            finalPartialFee = partialFee.toString();
          }
        }
      }
    }
    return {
      partialFee: finalPartialFee,
      api,
    };
  } catch (error) {
    console.log({error});
    Sentry.captureException(error);
    return error;
  }
};

export const signWithExtension = async (
  account: InjectedAccountWithMeta,
): Promise<string | null> => {
  try {
    const {web3FromSource} = await import('@polkadot/extension-dapp');

    const injector = await web3FromSource(account.meta.source);
    const signRaw = injector?.signer?.signRaw;

    if (signRaw) {
      const {signature} = await signRaw({
        address: account.address,
        data: numberToHex(1),
        type: 'bytes',
      });

      console.log({signature});
      return signature;
    } else {
      throw 'signRaw error!';
    }
  } catch (error) {
    console.log({error});
    return null;
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

    if (!allAccounts || allAccounts.length === 0) {
      throw new NoAccountException('Please import your account first!');
    }

    const keyring = new Keyring();

    const baseAddress = keyring.encodeAddress(from);

    // We select the first account matching baseAddress
    // `account` is of type InjectedAccountWithMeta
    const account = allAccounts.find(account => {
      // address from session must match address on polkadot extension
      return account.address === baseAddress;
    });

    // if sender account not yet been imported to Polkadot.js extension
    if (!account) {
      throw new NoAccountException('Account not registered on Polkadot.js extension');
    }

    // otherwise if account found
    const api = await connectToBlockchain(wsAddress);

    callback && callback({apiConnected: true});

    // to be able to retrieve the signer interface from this account
    // we can use web3FromSource which will return an InjectedExtension type
    const injector = await web3FromSource(account.meta.source);

    callback &&
      callback({
        apiConnected: true,
        signerOpened: true,
      });

    // here we use the api to create a balance transfer to some account of a value of 12345678
    const transferExtrinsic = native
      ? api.tx.balances.transfer(to, new BN(value.toString()))
      : api.tx.currencies.transfer(to, {TOKEN: currencyId}, value);

    // passing the injected account address as the first argument of signAndSend
    // will allow the api to retrieve the signer and the user will see the extension
    // popup asking to sign the balance transfer transaction
    const txInfo = await transferExtrinsic.signAsync(from, {
      signer: injector.signer,
      // make sure nonce does not stuck
      nonce: -1,
    });

    const unsub = await txInfo.send(result => {
      console.log(`Current status is ${result.status}`);

      if (result.status.isInBlock) {
        console.log(`Transaction included at blockHash ${result.status.asInBlock}`);
      } else if (result.status.isFinalized) {
        console.log(`Transaction finalized at blockHash ${result.status.asFinalized}`);
        unsub();

        api.disconnect();
      }
    });

    return txInfo.toHex();
  } catch (error) {
    if (!(error instanceof NoAccountException)) {
      Sentry.captureException(error);
    }

    throw error;
  }
};

export const checkAccountBalance = async (
  account: string,
  currency: Currency,
  callback: (change: BN) => void,
): Promise<CheckBalanceResult> => {
  let free: u128 | UInt;
  let nonce: u32 | undefined;
  const api = await connectToBlockchain(currency.rpcURL);

  if (currency.native) {
    const result = await api.query.system.account(account);

    free = result.data.free;
    nonce = result.nonce;

    listenToSystemBalanceChange(account, currency, free as u128, callback);
  } else {
    const result = await api.query.tokens.accounts<OrmlAccountData>(account, {
      TOKEN: currency.id,
    });

    free = result.free;

    listenToTokenBalanceChange(account, currency, result.free, callback);
  }

  return {
    free,
    nonce,
  };
};

const listenToSystemBalanceChange = async (
  account: string,
  currency: Currency,
  previousFree: u128,
  callback: (change: BN) => void,
) => {
  const api = await connectToBlockchain(currency.rpcURL);

  api.query.system.account(account, ({data: {free}, nonce}) => {
    // Calculate the delta
    const change = free.sub(previousFree);

    // Only display positive value changes (Since we are pulling `previous` above already,
    // the initial balance change will also be zero)
    if (!change.isZero()) {
      console.log(`New balance change of ${change}, nonce ${nonce}`);

      callback(change);
    }
  });
};

const listenToTokenBalanceChange = async (
  account: string,
  currency: Currency,
  previousFree: Balance,
  callback: (change: BN) => void,
) => {
  const api = await connectToBlockchain(currency.rpcURL);

  api.query.tokens.accounts(
    account,
    {
      TOKEN: currency.id,
    },
    ({free}: OrmlAccountData) => {
      // Calculate the delta
      const change = free.sub(previousFree);

      // Only display positive value changes (Since we are pulling `previous` above already,
      // the initial balance change will also be zero)
      if (!change.isZero()) {
        console.log(`New balance change of ${change}`);

        callback(change);
      }
    },
  );
};
