import * as Sentry from '@sentry/nextjs';

import {WsProvider, ApiPromise} from '@polkadot/api';
import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';
import {Keyring} from '@polkadot/keyring';
import {StorageKey, u128, u32, UInt} from '@polkadot/types';
import {AssetBalance} from '@polkadot/types/interfaces';
import {Balance} from '@polkadot/types/interfaces';
import {AnyTuple, Codec} from '@polkadot/types/types';
import {numberToHex} from '@polkadot/util';
import {BN, BN_TEN} from '@polkadot/util';

import {Server} from '../api/wallet';
import {NoAccountException} from './errors/NoAccountException';
import {SignRawException} from './errors/SignRawException';

import {BalanceDetail} from 'src/interfaces/balance';
import {Currency, CurrencyId} from 'src/interfaces/currency';
import {TipsBalanceInfo} from 'src/interfaces/network';
import {WalletDetail, WalletReferenceType} from 'src/interfaces/wallet';

interface signAndSendExtrinsicProps {
  from: string;
  to?: string;
  value: BN;
  wsAddress: string;
  native: boolean;
  decimal: number;
  walletDetail: WalletDetail;
  referenceId?: string;
}

interface SignTransactionCallbackProps {
  apiConnected?: boolean;
  signerOpened?: boolean;
  transactionSucceed?: boolean;
  transactionFailed?: boolean;
  message?: string;
}

interface EstimateFeeResponseProps {
  partialFee: BN | null;
}

type CheckBalanceResult = {
  free: u128 | UInt;
  nonce?: u32;
};

interface References {
  referenceType: string;
  referenceIds: string[];
}

export const connectToBlockchain = async (wsProvider: string): Promise<ApiPromise> => {
  const provider = new WsProvider(wsProvider);
  const api: ApiPromise = new ApiPromise({provider});
  await api.isReadyOrError;
  return api;
};

export const getMetadata = async (rpcUrl: string): Promise<number | null> => {
  try {
    const api = await connectToBlockchain(rpcUrl);
    // note: prefix can be 0 (prefix for Polkadot)
    const data = api.consts.system.ss58Prefix;

    if (data === null) {
      return null;
    } else {
      const prefix = data.toNumber();

      return prefix;
    }
  } catch (error) {
    console.log({error});
    return null;
  }
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
  walletDetail: WalletDetail,
  selectedCurrency: BalanceDetail,
): Promise<EstimateFeeResponseProps | null> => {
  try {
    let finalPartialFee = new BN(0);

    const api: ApiPromise = await connectToBlockchain(selectedCurrency.network.rpcURL);
    const RAND_AMOUNT = 123;
    const {referenceType, referenceId: to} = walletDetail;

    if (referenceType === WalletReferenceType.WALLET_ADDRESS) {
      const {partialFee} = selectedCurrency.native
        ? await api.tx.balances.transfer(to, RAND_AMOUNT).paymentInfo(from)
        : await api.tx.currencies
            .transfer(to, {TOKEN: selectedCurrency.symbol}, RAND_AMOUNT)
            .paymentInfo(from);

      if (selectedCurrency.id === CurrencyId.AUSD) {
        const tokenPerAca = await convertAcaBasedTxFee(api, selectedCurrency);

        if (tokenPerAca) {
          finalPartialFee = partialFee.div(BN_TEN.pow(new BN(13))).mul(new BN(tokenPerAca));
        }
      } else {
        finalPartialFee = partialFee.toBn();
      }
    } else {
      if (selectedCurrency.native) walletDetail.ftIdentifier = 'native';
      else walletDetail.ftIdentifier = selectedCurrency.referenceId;
      const {partialFee} = await api.tx.tipping
        .sendTip(walletDetail, RAND_AMOUNT)
        .paymentInfo(from);

      finalPartialFee = partialFee.toBn();
    }

    await api.disconnect();

    return {partialFee: finalPartialFee};
  } catch (error) {
    console.log({error});
    Sentry.captureException(error);
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
      throw SignRawException;
    }
  } catch (error) {
    console.log({error});
    return null;
  }
};

export const signAndSendExtrinsic = async (
  {from, value, referenceId, wsAddress, native, walletDetail}: signAndSendExtrinsicProps,
  callback?: (param: SignTransactionCallbackProps) => void,
): Promise<string | null> => {
  let api: ApiPromise = null;

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
    api = await connectToBlockchain(wsAddress);

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
    const {referenceId: accountId, referenceType} = walletDetail;
    const isWalletAddress = referenceType === WalletReferenceType.WALLET_ADDRESS;
    const assetId = parseInt(referenceId);
    const transferExtrinsic = isWalletAddress
      ? native
        ? api.tx.balances.transfer(accountId, value)
        : api.tx.octopusAssets.transfer(assetId, accountId, value)
      : api.tx.tipping.sendTip(walletDetail, value);

    // passing the injected account address as the first argument of signAndSend
    // will allow the api to retrieve the signer and the user will see the extension
    // popup asking to sign the balance transfer transaction
    const txInfo = await transferExtrinsic.signAsync(from, {
      signer: injector.signer,
      // make sure nonce does not stuck
      nonce: -1,
    });

    const txHash: string = await new Promise((resolve, reject) => {
      txInfo
        .send(({status, isError, events}) => {
          if (status.isInBlock) {
            console.log(`\tBlock hash    : ${status.asInBlock.toHex()}`);
          } else if (status.isFinalized) {
            console.log(`\tFinalized     : ${status.asFinalized.toHex()}`);
            resolve(status.asFinalized.toHex());
          } else if (isError) {
            console.log(`\tFinalized     : null`);
            reject('FailedToSendTip');
          }

          events.forEach(data => {
            if (data.event.method.toString() === 'ExtrinsicFailed') {
              reject(new Error(data.event.method.toString()));
            }
          });
        })
        .catch(err => {
          reject(err);
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

    listenToSystemBalanceChange(api, account, free as u128, callback);
  } else {
    const result = await api.query.octopusAssets.account<AssetBalance>(
      currency.referenceId,
      account,
    );

    free = result.balance;

    listenToTokenBalanceChange(api, account, currency, free, callback);
  }

  return {
    free,
    nonce,
  };
};

const listenToSystemBalanceChange = async (
  api: ApiPromise,
  account: string,
  previousFree: u128,
  callback: (change: BN) => void,
) => {
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
  api: ApiPromise,
  account: string,
  currency: Currency,
  previousFree: Balance,
  callback: (change: BN) => void,
) => {
  api.query.octopusAssets.account(currency.referenceId, account, ({balance}: AssetBalance) => {
    // Calculate the delta
    const change = balance.toBn().sub(previousFree.toBn());

    // Only display positive value changes (Since we are pulling `previous` above already,
    // the initial balance change will also be zero)
    if (!change.isZero()) {
      console.log(`New balance change of ${change}`);

      callback(change);
    }
  });
};

export const getClaimTip = async (
  api: ApiPromise,
  serverId: string,
  referenceType: string,
  referenceId: string,
  pageSize = 10,
): Promise<[StorageKey<AnyTuple>, Codec][] | null> => {
  try {
    const result = await api.query.tipping.tipsBalanceByReference.entriesPaged({
      args: [serverId, referenceType, referenceId],
      pageSize,
    });

    return result;
  } catch {
    // ignore
  }

  return null;
};

export const claimTip = async (
  accountId: string,
  rpcURL: string,
  serverId: string,
  referenceId: string,
  ftIdentifiers: string[],
): Promise<void> => {
  try {
    const {enableExtension} = await import('src/helpers/extension');
    const {web3FromSource} = await import('@polkadot/extension-dapp');
    const allAccounts = await enableExtension();

    if (!allAccounts || allAccounts.length === 0)
      throw new NoAccountException('Please import your account first!');

    const keyring = new Keyring();
    const baseAddress = keyring.encodeAddress(accountId);
    const account = allAccounts.find(account => account.address === baseAddress);

    if (!account) throw new NoAccountException('Account not registered on Polkadot.js extension');

    const api = await connectToBlockchain(rpcURL);
    const injector = await web3FromSource(account.meta.source);
    const extrinsic = api.tx.tipping.claimTip(serverId, 'user', referenceId, ftIdentifiers);

    const txInfo = await extrinsic.signAsync(accountId, {
      signer: injector.signer,
      // make sure nonce does not stuck
      nonce: -1,
    });

    await new Promise((resolve, reject) => {
      txInfo
        .send(({status, isError, events}) => {
          if (status.isInBlock) {
            console.log(`\tBlock hash    : ${status.asInBlock.toHex()}`);
          } else if (status.isFinalized) {
            console.log(`\tFinalized     : ${status.asFinalized.toHex()}`);
            resolve(status.asFinalized.toHex());
          } else if (isError) {
            console.log(`\tFinalized     : null`);
            reject('FailedToClaimTip');
          }

          events.forEach(data => {
            if (data.event.method.toString() === 'ExtrinsicFailed') {
              reject(new Error(data.event.method.toString()));
            }
          });
        })
        .catch(err => {
          reject(err);
        });
    });
  } catch (err) {
    throw err;
  }
};

export const sendTip = async (
  account: InjectedAccountWithMeta,
  rpcURL: string,
  tipsBalanceInfo: TipsBalanceInfo,
  amount: string,
  callback?: (param: SignTransactionCallbackProps) => void,
): Promise<string> => {
  try {
    const {web3FromSource} = await import('@polkadot/extension-dapp');
    const api = await connectToBlockchain(rpcURL);

    callback && callback({apiConnected: true});

    const injector = await web3FromSource(account.meta.source);

    callback &&
      callback({
        apiConnected: true,
        signerOpened: true,
      });

    const extrinsic = api.tx.tipping.sendTip(tipsBalanceInfo, new BN(amount));
    const txInfo = await extrinsic.signAsync(account.address, {
      signer: injector.signer,
      nonce: -1,
    });

    return new Promise((resolve, reject) => {
      txInfo
        .send(({status, isError, events}) => {
          if (status.isInBlock) {
            console.log(`\tBlock hash    : ${status.asInBlock.toHex()}`);
          } else if (status.isFinalized) {
            console.log(`\tFinalized     : ${status.asFinalized.toHex()}`);
            resolve(status.asFinalized.toHex());
          } else if (isError) {
            console.log(`\tFinalized     : null`);
            reject('FailedToSendTip');
          }

          events.forEach(data => {
            if (data.event.method.toString() === 'ExtrinsicFailed') {
              reject(new Error(data.event.method.toString()));
            }
          });
        })
        .catch(err => {
          reject(err);
        });
    });
  } catch (err) {
    throw err;
  }
};

export const claimReferenceFee = async (
  api: ApiPromise,
  references: References,
  mainReferences: References,
  currencyIds: string[],
  accountId: string,
  server?: Server,
): Promise<BN> => {
  if (!server) return new BN(0);
  if (server && !server?.accountId?.myriad) return new BN(0);

  try {
    const {partialFee} = await api.tx.tipping
      .claimReference(server.id, references, mainReferences, currencyIds, accountId, 1)
      .paymentInfo(server.accountId.myriad);

    return partialFee.toBn();
  } catch {
    //
  }

  return new BN(0);
};
