import {WsProvider, ApiPromise} from '@polkadot/api';
import {SubmittableExtrinsicFunction} from '@polkadot/api/types';
import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';
import {Keyring} from '@polkadot/keyring';
import {StorageKey} from '@polkadot/types';
import {AssetBalance, AssetDetails} from '@polkadot/types/interfaces';
import {AnyTuple, Codec} from '@polkadot/types/types';
import {numberToHex} from '@polkadot/util';
import {BN, BN_ZERO} from '@polkadot/util';

import {
  BalanceProps,
  changeBalanceCallback,
  ClaimReferenceData,
  EstimateFeeResponseProps,
  SignTransaction,
  SignTransactionCallbackProps,
  TipsBalanceInfo,
} from '../../interfaces/blockchain-interface';
import {IProvider} from '../../interfaces/blockchain-interface';
import {NoAccountException} from './errors/NoAccountException';
import {SignRawException} from './errors/SignRawException';

import {formatBalanceV2} from 'src/helpers/balance';
import {Network} from 'src/interfaces/network';
import {WalletDetail, WalletReferenceType} from 'src/interfaces/wallet';

export class PolkadotJs implements IProvider {
  private _accountId: string;
  private readonly _provider: ApiPromise;
  private readonly _network: Network;

  constructor(provider?: ApiPromise, network?: Network) {
    this._provider = provider;
    this._network = network;
  }

  get provider() {
    return this._provider;
  }

  get network() {
    return this._network;
  }

  get accountId() {
    return this._accountId;
  }

  set accountId(address: string) {
    this._accountId = address;
  }

  static async connect(network?: Network) {
    if (!network) return new PolkadotJs();

    try {
      const provider = new WsProvider(network.rpcURL);
      const api = new ApiPromise({provider});
      await api.isReadyOrError;

      return new PolkadotJs(api, network);
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  static async signWithWallet(
    account: InjectedAccountWithMeta,
    nonce: number,
    callback?: (param: SignTransactionCallbackProps) => void,
  ): Promise<string | null> {
    try {
      const {web3FromSource} = await import('@polkadot/extension-dapp');

      callback && callback({signerOpened: true});

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
      return null;
    }
  }

  static async claimTipBalances(
    api: ApiPromise,
    serverId: string,
    referenceType: string,
    referenceIds: string[],
    pageSize = 10,
  ): Promise<[StorageKey<AnyTuple>, Codec][]> {
    try {
      const result = await api.query.tipping.tipsBalanceByReference.entriesPaged({
        args: [serverId, referenceType, referenceIds[0]],
        pageSize,
      });

      return result;
    } catch {
      // ignore
    }

    return null;
  }

  static async claimReferenceFee(
    api: ApiPromise,
    accountId: string,
    data: ClaimReferenceData,
  ): Promise<BN> {
    const server = data?.server;

    if (!server) return new BN(0);
    if (server && !server?.accountId?.myriad) return new BN(0);

    try {
      const serverId = server.accountId.myriad;
      const {references, mainReferences, currencyIds} = data;
      const {partialFee} = await api.tx.tipping
        .claimReference(serverId, references, mainReferences, currencyIds, accountId, 1)
        .paymentInfo(serverId);

      return partialFee.toBn();
    } catch {
      //
    }

    return new BN(0);
  }

  async signer(...args: InjectedAccountWithMeta[]): Promise<InjectedAccountWithMeta> {
    const [account] = args;
    const keyring = new Keyring();
    const baseAddress = account ? account.address : keyring.encodeAddress(this.accountId);

    let currentAccount = account;

    if (!account) {
      const {enableExtension} = await import('src/helpers/extension');
      const allAccounts = await enableExtension();

      if (!allAccounts || allAccounts.length === 0) {
        throw new NoAccountException('Please import your account first!');
      }

      // We select the first account matching baseAddress
      // `account` is of type InjectedAccountWithMeta
      currentAccount = allAccounts.find(account => {
        // address from session must match address on polkadot extension
        return account.address === baseAddress;
      });
    }

    // if sender account not yet been imported to Polkadot.js extension
    if (!currentAccount) {
      throw new NoAccountException('Account not registered on Polkadot.js extension');
    }

    return currentAccount;
  }

  async getMetadata(): Promise<number> {
    try {
      const data = this.provider.consts.system.ss58Prefix;

      if (data === null) return null;
      return data.toNumber();
    } catch {
      return 42;
    }
  }

  async balances(
    decimal: number,
    referenceId?: string,
    ...args: changeBalanceCallback[]
  ): Promise<BalanceProps> {
    const [callback] = args;

    if (!this.accountId) return {balance: '0'};
    if (referenceId) {
      const result = await this.provider.query.octopusAssets.account<Codec>(
        referenceId,
        this.accountId,
      );

      if (result.isEmpty) return {balance: '0'};

      const assetBalance = result.toHuman() as unknown as AssetBalance;
      const balance = assetBalance.balance.toString().replace(/,/gi, '');

      this.listenToAssetBalanceChange(this.accountId, referenceId, new BN(balance), callback);

      return {balance: formatBalanceV2(balance, decimal, 18)};
    }

    const {data, nonce} = await this.provider.query.system.account(this.accountId);

    this.listenToSystemBalanceChange(this.accountId, data.free, callback);

    return {
      balance: formatBalanceV2(data.free.toString(), decimal, 18),
      nonce,
    };
  }

  async signTippingTransaction(
    walletDetail: WalletDetail,
    amount: BN,
    referenceId?: string,
    ...args: [InjectedAccountWithMeta, SignTransaction]
  ): Promise<string | null> {
    const [account, callback] = args;

    try {
      if (!this.accountId) throw new Error('AccountNotSet');

      const api = this.provider;
      const {web3FromSource} = await import('@polkadot/extension-dapp');

      const signer = await this.signer(account);

      // to be able to retrieve the signer interface from this account
      // we can use web3FromSource which will return an InjectedExtension type
      const injector = await web3FromSource(signer.meta.source);

      callback && callback({signerOpened: true});

      // here we use the api to create a balance transfer to some account of a value of 12345678
      const {referenceId: accountId, referenceType} = walletDetail;
      const isWalletAddress = referenceType === WalletReferenceType.WALLET_ADDRESS;
      const assetId = parseInt(referenceId);
      const transferExtrinsic = isWalletAddress
        ? !referenceId
          ? api.tx.balances.transfer(accountId, amount)
          : api.tx.octopusAssets.transfer(assetId, accountId, amount)
        : api.tx.tipping.sendTip(walletDetail, amount);

      // passing the injected account address as the first argument of signAndSend
      // will allow the api to retrieve the signer and the user will see the extension
      // popup asking to sign the balance transfer transaction
      const txInfo = await transferExtrinsic.signAsync(signer.address, {
        signer: injector.signer,
        // make sure nonce does not stuck
        nonce: -1,
      });

      const txHash: string = await new Promise((resolve, reject) => {
        txInfo
          .send(({status, isError, dispatchError}) => {
            if (status.isInBlock) {
              console.log(`\tBlock hash    : ${status.asInBlock.toHex()}`);
            } else if (status.isFinalized) {
              console.log(`\tFinalized     : ${status.asFinalized.toHex()}`);
              resolve(status.asFinalized.toHex());
            } else if (isError) {
              console.log(`\tFinalized     : null`);
              reject('FailedToSendTip');
            }

            if (dispatchError) {
              if (dispatchError.isModule) {
                const {name} = api.registry.findMetaError(dispatchError.asModule);

                reject(new Error(name));
              } else {
                const dispatchErrorType = dispatchError.toString();
                const parseDispatch = JSON.parse(dispatchErrorType);

                const values: string[] = Object.values(parseDispatch);

                reject(new Error(values[0] ?? 'ExtrinsicFailed'));
              }
            }
          })
          .catch(err => {
            reject(err);
          });
      });

      return txHash;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async claimTip(
    serverId: string,
    referenceId: string,
    ...args: [string[], string, boolean]
  ): Promise<void> {
    try {
      const [ftIdentifiers] = args;
      const {web3FromSource} = await import('@polkadot/extension-dapp');

      const signer = await this.signer();
      const api = this.provider;
      const injector = await web3FromSource(signer.meta.source);
      const extrinsic = api.tx.tipping.claimTip(serverId, 'user', referenceId, ftIdentifiers);

      const txInfo = await extrinsic.signAsync(signer.address, {
        signer: injector.signer,
        // make sure nonce does not stuck
        nonce: -1,
      });

      await new Promise((resolve, reject) => {
        txInfo
          .send(({status, isError, dispatchError}) => {
            if (status.isInBlock) {
              console.log(`\tBlock hash    : ${status.asInBlock.toHex()}`);
            } else if (status.isFinalized) {
              console.log(`\tFinalized     : ${status.asFinalized.toHex()}`);
              resolve(status.asFinalized.toHex());
            } else if (isError) {
              console.log(`\tFinalized     : null`);
              reject('FailedToClaimTip');
            }

            if (dispatchError) {
              if (dispatchError.isModule) {
                const {name} = api.registry.findMetaError(dispatchError.asModule);

                reject(new Error(name));
              } else {
                const dispatchErrorType = dispatchError.toString();
                const parseDispatch = JSON.parse(dispatchErrorType);

                const values: string[] = Object.values(parseDispatch);

                reject(new Error(values[0] ?? 'ExtrinsicFailed'));
              }
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    } catch (err) {
      throw err;
    }
  }

  async payTransactionFee(
    tipsBalanceInfo: TipsBalanceInfo,
    trxFee: string,
    nativeBalance?: string,
    ...args: [InjectedAccountWithMeta, SignTransaction]
  ): Promise<string> {
    const [account, callback] = args;
    const walletDetail = {...tipsBalanceInfo, referenceType: WalletReferenceType.USER};
    return this.signTippingTransaction(walletDetail, new BN(trxFee), 'native', account, callback);
  }

  async estimateFee(...args: WalletDetail[]): Promise<EstimateFeeResponseProps> {
    const [walletDetail] = args;

    if (!this.accountId) return {partialFee: null};
    if (!walletDetail) return {partialFee: null};

    try {
      const api = this.provider;
      const RAND_AMOUNT = 123;
      const {referenceType, referenceId: to} = walletDetail;
      const isWalletAddress = referenceType === WalletReferenceType.WALLET_ADDRESS;
      const extType = isWalletAddress ? 'balances' : 'tipping';
      const method = isWalletAddress ? 'transfer' : 'sendTip';
      const dest = isWalletAddress ? to : walletDetail;
      const extrinsic = api.tx[extType][method] as SubmittableExtrinsicFunction<'promise'>;
      const {partialFee} = await extrinsic(dest, RAND_AMOUNT).paymentInfo(this.accountId);

      return {partialFee: partialFee.toBn()};
    } catch {
      return {partialFee: null};
    }
  }

  async disconnect(): Promise<void> {
    await this.provider.disconnect();
  }

  async assetMinBalance(ftIdentifier?: string): Promise<EstimateFeeResponseProps> {
    const assetId = parseInt(ftIdentifier);
    if (isNaN(assetId)) return {partialFee: BN_ZERO};
    const result = await this.provider.query.octopusAssets.asset<Codec>(assetId);
    if (result.isEmpty) return {partialFee: BN_ZERO};
    const assetDetails = result.toHuman() as unknown as AssetDetails;
    return {partialFee: new BN(assetDetails.minBalance.toString().replace(/,/gi, ''))};
  }

  private async listenToSystemBalanceChange(
    account: string,
    previousFree: BN,
    callback: (change: BN) => void,
  ) {
    this.provider.query.system.account(account, ({data: {free}, nonce}) => {
      // Calculate the delta
      const change = free.sub(previousFree);

      // Only display positive value changes (Since we are pulling `previous` above already,
      // the initial balance change will also be zero)
      if (!change.isZero()) {
        console.log(`New balance change of ${change}, nonce ${nonce}`);

        callback(change);
      }
    });
  }

  private async listenToAssetBalanceChange(
    account: string,
    assetId: string,
    previousFree: BN,
    callback: (change: BN) => void,
  ) {
    this.provider.query.octopusAssets.account(assetId, account, (result: Codec) => {
      if (result.isEmpty) return;
      const assetBalance = result.toHuman() as unknown as AssetBalance;
      const balance = assetBalance.balance.toString().replace(/,/gi, '');
      // Calculate the delta
      const change = new BN(balance).sub(previousFree);
      // Only display positive value changes (Since we are pulling `previous` above already,
      // the initial balance change will also be zero)
      if (!change.isZero()) {
        console.log(`New balance change of ${change}`);
        callback(change);
      }
    });
  }

  async payUnlockableContent(
    walletAddress: string,
    tipsBalanceInfo: TipsBalanceInfo,
    amount: BN,
    ...args: [InjectedAccountWithMeta, SignTransaction]
  ): Promise<string | null> {
    const [account, callback] = args;

    try {
      if (!this.accountId) throw new Error('AccountNotSet');

      const api = this.provider;
      const {web3FromSource} = await import('@polkadot/extension-dapp');

      const signer = await this.signer(account);

      // to be able to retrieve the signer interface from this account
      // we can use web3FromSource which will return an InjectedExtension type
      const injector = await web3FromSource(signer.meta.source);

      callback && callback({signerOpened: true});

      // here we use the api to create a balance transfer to some account of a value of 12345678
      const transferExtrinsic = api.tx.tipping.payContent(walletAddress, tipsBalanceInfo, amount);

      // passing the injected account address as the first argument of signAndSend
      // will allow the api to retrieve the signer and the user will see the extension
      // popup asking to sign the balance transfer transaction
      const txInfo = await transferExtrinsic.signAsync(signer.address, {
        signer: injector.signer,
        // make sure nonce does not stuck
        nonce: -1,
      });

      const txHash: string = await new Promise((resolve, reject) => {
        txInfo
          .send(({status, isError, dispatchError}) => {
            if (status.isInBlock) {
              console.log(`\tBlock hash    : ${status.asInBlock.toHex()}`);
            } else if (status.isFinalized) {
              console.log(`\tFinalized     : ${status.asFinalized.toHex()}`);
              resolve(status.asFinalized.toHex());
            } else if (isError) {
              console.log(`\tFinalized     : null`);
              reject('FailedToSendTip');
            }

            if (dispatchError) {
              if (dispatchError.isModule) {
                const {name} = api.registry.findMetaError(dispatchError.asModule);

                reject(new Error(name));
              } else {
                const dispatchErrorType = dispatchError.toString();
                const parseDispatch = JSON.parse(dispatchErrorType);

                const values: string[] = Object.values(parseDispatch);

                reject(new Error(values[0] ?? 'ExtrinsicFailed'));
              }
            }
          })
          .catch(err => {
            reject(err);
          });
      });

      return txHash;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
