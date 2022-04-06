import {options} from '@acala-network/api';
import {Balance, OrmlAccountData} from '@open-web3/orml-types/interfaces';
import * as Sentry from '@sentry/nextjs';
import {AnyObject} from '@udecode/plate';

import {ApiPromise, WsProvider} from '@polkadot/api';
import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';
import {Keyring} from '@polkadot/keyring';
import {u128, u32, UInt} from '@polkadot/types';
import {numberToHex} from '@polkadot/util';
import {BN, BN_TEN} from '@polkadot/util';

import {NoAccountException} from './errors/NoAccountException';

import {BalanceDetail} from 'src/interfaces/balance';
import {Currency, CurrencyId} from 'src/interfaces/currency';
import {UserWallet} from 'src/interfaces/user';

interface signAndSendExtrinsicProps {
  from: string;
  to: string;
  value: BN;
  currencyId: string;
  wsAddress: string;
  native: boolean;
  decimal: number;
}

interface SignTransactionCallbackProps {
  apiConnected?: boolean;
  signerOpened?: boolean;
}

interface EstimateFeeResponseProps {
  partialFee: BN | null;
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

    let finalPartialFee = new BN(0);

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
        api = await connectToBlockchain(selectedCurrency.network.rpcURL);

        if (api) {
          const RAND_AMOUNT = 123;

          const {partialFee} = selectedCurrency.native
            ? await api.tx.balances.transfer(to, RAND_AMOUNT).paymentInfo(from)
            : await api.tx.currencies
                .transfer(to, {TOKEN: selectedCurrency.id}, RAND_AMOUNT)
                .paymentInfo(from);

          if (selectedCurrency.id === CurrencyId.AUSD) {
            const tokenPerAca = await convertAcaBasedTxFee(api, selectedCurrency);

            if (tokenPerAca) {
              finalPartialFee = partialFee.div(BN_TEN.pow(new BN(13))).mul(new BN(tokenPerAca));
            }
          } else {
            finalPartialFee = partialFee.toBn();
          }

          api.disconnect();
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
  nonce: number,
): Promise<string | null> => {
  try {
    const {web3FromSource} = await import('@polkadot/extension-dapp');

    const injector = await web3FromSource(account.meta.source);
    const signRaw = injector?.signer?.signRaw;

    if (signRaw) {
      const {signature} = await signRaw({
        address: account.address,
        data: numberToHex(nonce),
        type: 'bytes',
      });

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
  {from, to, value, currencyId, wsAddress, native, decimal}: signAndSendExtrinsicProps,
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
      ? api.tx.balances.transfer(to, value)
      : api.tx.currencies.transfer(to, {TOKEN: currencyId}, value);

    let txHash: string | null = null;

    // passing the injected account address as the first argument of signAndSend
    // will allow the api to retrieve the signer and the user will see the extension
    // popup asking to sign the balance transfer transaction
    const txInfo = await transferExtrinsic.signAsync(from, {
      signer: injector.signer,
      // make sure nonce does not stuck
      nonce: -1,
    });

    await new Promise((resolve, reject) => {
      txInfo.send(result => {
        if (result.status.isInBlock) {
          console.log(`\tBlock hash    : ${txHash}`);
        } else if (result.status.isFinalized) {
          txHash = result.status.asFinalized.toHex();
          console.log(`\tFinalized     : ${txHash}`);
          api.disconnect();
          resolve(txHash);
        } else if (result.isError) {
          console.log(`\tFinalized     : null`);
          api.disconnect();
          reject();
        }
      });
    });

    return txHash;
  } catch (error) {
    console.error(error);
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
  const api = await connectToBlockchain(currency.network.rpcURL);

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
  const api = await connectToBlockchain(currency.network.rpcURL);

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
  const api = await connectToBlockchain(currency.network.rpcURL);

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

interface TipBalanceInfo {
  serverId: string;
  referenceType: string;
  referenceId: string;
  ftIdentifier: string;
}

export interface TipResult {
  tipsBalanceInfo: TipBalanceInfo;
  accountId: string;
  amount: string;
}

export const getClaimTip = async (
  {serverId, referenceType, referenceId, ftIdentifier}: TipBalanceInfo,
  rpcURL: string,
): Promise<TipResult | null> => {
  try {
    const api = await connectToBlockchain(rpcURL);
    const result = await api.query.tipping.tipsBalanceByReference(
      serverId,
      referenceType,
      referenceId,
      ftIdentifier,
    );

    if (result.toJSON() == null) return null;

    return result.toHuman() as AnyObject as TipResult;
  } catch (error) {
    console.log({error});
    return null;
  }
};

export const claimMyria = async (
  payload: TipBalanceInfo,
  rpcURL: string,
  currentWallet: UserWallet,
): Promise<void> => {
  const {enableExtension} = await import('src/helpers/extension');
  const {web3FromSource} = await import('@polkadot/extension-dapp');

  try {
    const allAccounts = await enableExtension();
    if (!allAccounts || allAccounts.length === 0)
      throw new NoAccountException('Please import your account first!');

    const keyring = new Keyring();
    const baseAddress = keyring.encodeAddress(currentWallet.id);
    const account = allAccounts.find(account => account.address === baseAddress);

    if (!account) throw new NoAccountException('Account not registered on Polkadot.js extension');

    const injector = await web3FromSource(account.meta.source);
    const api = await connectToBlockchain(rpcURL);
    const extrinsic = api.tx.tipping.claimTip(payload);

    extrinsic.signAndSend(currentWallet.id, {nonce: -1, signer: injector.signer});
    console.log(extrinsic, 9876);
  } catch (error) {
    console.log(error);
  }
};
