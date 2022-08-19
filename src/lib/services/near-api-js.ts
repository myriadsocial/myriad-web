import getConfig from 'next/config';

import {isHex} from '@polkadot/util';
import {BN, BN_ZERO} from '@polkadot/util/bn';
import {numberToHex} from '@polkadot/util/number';
import {u8aToHex} from '@polkadot/util/u8a';

import {
  BalanceProps,
  CallbackURL,
  ContractProps,
  EstimateFeeResponseProps,
  IProvider,
  NearInitializeProps,
  SignatureProps,
  TipsBalanceInfo,
  TipsNearResult,
  TipsNearResultWithPagination,
} from '../../interfaces/blockchain-interface';

import assign from 'lodash/assign';
import * as nearAPI from 'near-api-js';
import type {Signature} from 'near-api-js/lib/utils/key_pair';
import {formatBalance} from 'src/helpers/balance';
import {Network} from 'src/interfaces/network';
import {WalletDetail, WalletReferenceType, WalletTypeEnum} from 'src/interfaces/wallet';
import * as WalletAPI from 'src/lib/api/wallet';

const {publicRuntimeConfig} = getConfig();

type SignNearData = {
  userId?: string;
  nonce?: number;
  walletType?: WalletTypeEnum;
};

export class Near implements IProvider {
  private _accountId: string;
  private readonly _provider: NearInitializeProps;
  private readonly _network: Network;

  private readonly ONE_YOCTO = new BN('1');
  private readonly MAX_GAS = new BN('300000000000000');
  private readonly ATTACHED_AMOUNT = new BN('1250000000000000000000');
  private readonly ATTACHED_GAS = new BN('10000000000000');

  constructor(provider?: NearInitializeProps, network?: Network) {
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

  static async connect(network?: Network, walletType = WalletTypeEnum.NEAR): Promise<Near> {
    if (!network) return new Near();
    try {
      const {keyStores, connect, WalletConnection} = nearAPI;
      // creates keyStore using private key in local storage
      // *** REQUIRES SignIn using walletConnection.requestSignIn() ***
      const keyStore = new keyStores.BrowserLocalStorageKeyStore();
      const walletURL =
        walletType === WalletTypeEnum.MYNEAR ? network.additionalWalletURL : network.walletURL;

      // set config for near network
      const config: nearAPI.ConnectConfig = {
        networkId: network.chainId ?? 'testnet',
        keyStore,
        nodeUrl: network.rpcURL,
        walletUrl: walletURL,
        helperUrl: network.helperURL,
        headers: {},
      };

      const near = await connect(assign({deps: {keyStore}}, config));
      const wallet = new WalletConnection(near, 'myriad-social');
      return new Near({near, wallet}, network);
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  static async signWithWallet(
    wallet: nearAPI.WalletConnection,
    callbackURL?: CallbackURL,
    signNearData?: SignNearData,
    action?: string,
  ): Promise<SignatureProps | null> {
    const keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore();

    try {
      if (!wallet.isSignedIn()) throw 'RequestSignIn';
      const address = wallet.getAccountId();

      console.log(`[${action}][keystore][signature]`, JSON.stringify(keyStore));
      console.log(`[${action}][walletaddress]`, address, wallet._networkId);

      const keyPair = await keyStore.getKey(wallet._networkId, address);
      const userId = signNearData?.userId;

      let nonce = signNearData?.nonce;

      if (!nonce) {
        ({nonce} = await (userId
          ? WalletAPI.getUserNonceByUserId(userId)
          : WalletAPI.getUserNonce(address)));
      }

      const userSignature: Signature = keyPair.sign(Buffer.from(numberToHex(nonce)));
      const publicKey = u8aToHex(userSignature.publicKey.data);

      console.log(`[${action}][publicKey]`, publicKey);

      const userSignatureHex = u8aToHex(userSignature.signature);

      const publicAddress = `${publicKey}/${address}`;
      const signature = userSignatureHex;

      console.log(`[${action}][signature]`, signature);

      return {nonce, publicAddress, signature};
    } catch {
      console.log(`[${action}][keystore][requestSignIn]`, JSON.stringify(keyStore));

      if (wallet.isSignedIn()) wallet.signOut();
      const successUrl = callbackURL?.successCallbackURL;
      const failureUrl = callbackURL?.failedCallbackURL;
      const auth = signNearData?.walletType ?? WalletTypeEnum.NEAR;

      const signInOptions = {
        contractId: publicRuntimeConfig.nearTippingContractId,
        methodNames: ['claim_tip', 'batch_claim_tips'],
        successUrl: successUrl ?? `${publicRuntimeConfig.appAuthURL}/?auth=${auth}`,
        failureUrl: failureUrl ?? `${publicRuntimeConfig.appAuthURL}`,
      };

      await Promise.all([keyStore.clear(), wallet.requestSignIn(signInOptions)]);
      return null;
    }
  }

  static async claimTipBalances(
    rpcURL: string,
    serverId: string,
    referenceId: string,
    referenceIds: string[],
    pageSize = 10,
  ): Promise<TipsNearResult[]> {
    const provider = new nearAPI.providers.JsonRpcProvider({url: rpcURL});
    const tippingContractId = publicRuntimeConfig.nearTippingContractId;

    try {
      const data = JSON.stringify({
        server_id: serverId,
        reference_type: 'people',
        reference_ids: referenceIds,
        main_ref_type: 'user',
        main_ref_id: referenceId,
        page_number: 1,
        page_limit: pageSize,
      });

      const buff = Buffer.from(data);
      const base64data = buff.toString('base64');
      const result = await provider.query({
        request_type: 'call_function',
        account_id: tippingContractId,
        method_name: 'get_tips_balances',
        args_base64: base64data,
        finality: 'final',
      });

      const tipsBalances: TipsNearResultWithPagination = JSON.parse(
        Buffer.from((result as any).result).toString(),
      );

      return tipsBalances.data;
    } catch {
      //
    }

    return [];
  }

  static async claimReferenceFee(rpcURL: string): Promise<BN> {
    try {
      const rpcProvider = new nearAPI.providers.JsonRpcProvider({url: rpcURL});
      const {gas_price} = await rpcProvider.gasPrice(null);

      return new BN(gas_price).mul(new BN('300000000000000'));
    } catch {
      return new BN(0);
    }
  }

  static async clearLocalStorage(): Promise<void> {
    const keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore();
    await keyStore.clear();
  }

  async signer(): Promise<nearAPI.ConnectedWalletAccount> {
    const {wallet} = this.provider;
    return wallet.account();
  }

  async getMetadata(): Promise<number> {
    return null;
  }

  async balances(decimal: number, referenceId?: string): Promise<BalanceProps> {
    const accountId = isHex(this.accountId) ? this.accountId.substring(2) : this.accountId;

    if (!accountId) return {balance: '0'};
    if (referenceId && decimal) {
      const contract = await this.contractInitialize(referenceId, 'ft_balance_of');
      const contractBalance = await contract.ft_balance_of({account_id: accountId});
      return {balance: formatBalance(new BN(contractBalance), decimal).toString()};
    }

    const {near} = this.provider;
    const account = await near.account(accountId);
    const balance = await account.getAccountBalance();
    const reservedForTransaction = nearAPI.utils.format.parseNearAmount('0.05');
    const finalBalance =
      parseFloat(balance.available) <= parseFloat(reservedForTransaction)
        ? '0'
        : new BN(balance.available).sub(new BN(reservedForTransaction));

    return {balance: nearAPI.utils.format.formatNearAmount(finalBalance.toString())};
  }

  async signTippingTransaction(
    walletDetail: WalletDetail,
    amount: BN,
    referenceId?: string,
  ): Promise<string | null> {
    const walletReferenceType = walletDetail.referenceType;
    const receiver =
      walletReferenceType === WalletReferenceType.WALLET_ADDRESS
        ? walletDetail.referenceId
        : undefined;

    if (receiver) return this.sendAmountToMyriadUser(receiver, amount, referenceId);
    return this.sendAmountToNonMyriadUser(walletDetail, amount, referenceId);
  }

  async claimTip(
    serverId: string,
    referenceId: string,
    ...args: [string[], string, boolean]
  ): Promise<void> {
    const [ftIdentifiers, txInfo, all] = args;
    const signer = await this.signer();
    const tippingContractId = publicRuntimeConfig.nearTippingContractId;
    const data = all
      ? JSON.stringify({
          server_id: serverId,
          reference_type: 'user',
          reference_id: referenceId,
        })
      : JSON.stringify({
          tips_balance_info: {
            server_id: serverId,
            reference_type: 'user',
            reference_id: referenceId,
            ft_identifier: ftIdentifiers[0],
          },
        });

    const actions = [
      nearAPI.transactions.functionCall(
        all ? 'batch_claim_tips' : 'claim_tip',
        Buffer.from(data),
        this.MAX_GAS,
        this.ONE_YOCTO,
      ),
    ];
    const walletCallbackUrl = `${publicRuntimeConfig.appAuthURL}/wallet?type=tip&txInfo=${txInfo}`;
    //TODO: fix error protected class for multiple sign and send transactions
    // @ts-ignore: protected class
    await signer.signAndSendTransaction({
      receiverId: tippingContractId,
      actions,
      walletCallbackUrl,
    });
  }

  async payTransactionFee(
    tipsBalanceInfo: TipsBalanceInfo,
    trxFee: string,
    nativeBalance?: string,
  ): Promise<string> {
    const {serverId, referenceType, referenceId, ftIdentifier} = tipsBalanceInfo;

    const tippingContractId = publicRuntimeConfig.nearTippingContractId;
    const data = JSON.stringify({
      tips_balance_info: {
        server_id: serverId,
        reference_type: referenceType,
        reference_id: referenceId,
        ft_identifier: ftIdentifier,
      },
    });

    //inisialisasi near wallet
    const signer = await this.signer();
    const actions = [
      nearAPI.transactions.functionCall(
        'send_tip',
        Buffer.from(data),
        this.MAX_GAS,
        new BN(trxFee),
      ),
    ];
    const appAuthURL = publicRuntimeConfig.appAuthURL;
    const url = `${appAuthURL}/wallet?type=tip&txFee=${trxFee}&balance=${nativeBalance}`;
    //TODO: fix error protected class for multiple sign and send transactions
    // @ts-ignore: protected class
    await signer.signAndSendTransaction({
      receiverId: tippingContractId,
      actions,
      walletCallbackUrl: url,
    });
    return '';
  }

  async estimateFee(): Promise<EstimateFeeResponseProps> {
    try {
      const {near} = this.provider;
      const blockStatus = await near.connection.provider.status();
      const gas = await near.connection.provider.gasPrice(blockStatus.sync_info.latest_block_hash);

      return {partialFee: new BN(gas.gas_price)};
    } catch {
      return {partialFee: null};
    }
  }

  async disconnect(): Promise<void> {
    const {wallet} = this.provider;

    await Near.clearLocalStorage();

    if (wallet.isSignedIn()) {
      wallet.signOut();
    }
  }

  async assetMinBalance(): Promise<EstimateFeeResponseProps> {
    return {partialFee: BN_ZERO};
  }

  private async contractInitialize(
    contractId: string,
    viewMethod?: string,
    changeMethod?: string,
  ): Promise<ContractProps> {
    try {
      const {wallet} = this.provider;
      const contract = new nearAPI.Contract(wallet.account(), contractId, {
        viewMethods: [viewMethod],
        changeMethods: [changeMethod],
      });
      //TODO: fix type for return all of the contract
      return contract as unknown as ContractProps;
    } catch (error) {
      console.log({error});
      throw error;
    }
  }

  private async sendAmountToMyriadUser(
    receiver: string,
    amount: BN,
    tokenContractId?: string,
  ): Promise<string> {
    const receiverId = isHex(receiver) ? receiver.substring(2) : receiver;
    const signer = await this.signer();

    if (!tokenContractId) {
      await signer.sendMoney(receiverId, amount);
      return;
    }

    const contract = await this.contractInitialize(tokenContractId, 'storage_balance_of');
    const isDeposit = await contract.storage_balance_of({account_id: receiverId});
    const actions: nearAPI.transactions.Action[] = !isDeposit
      ? [
          nearAPI.transactions.functionCall(
            'storage_deposit',
            Buffer.from(JSON.stringify({account_id: receiverId})),
            this.ATTACHED_GAS,
            this.ATTACHED_AMOUNT,
          ),
        ]
      : [];

    actions.push(
      nearAPI.transactions.functionCall(
        'ft_transfer',
        Buffer.from(JSON.stringify({receiver_id: receiverId, amount: amount.toString()})),
        this.MAX_GAS.sub(this.ATTACHED_GAS),
        this.ONE_YOCTO,
      ),
    );
    //TODO: fix error protected class for multiple sign and send transactions
    // @ts-ignore: protected class
    await signer.signAndSendTransaction({receiverId: tokenContractId, actions});

    return;
  }

  private async sendAmountToNonMyriadUser(
    walletDetail: WalletDetail,
    amount: BN,
    tokenContractId?: string,
  ): Promise<string> {
    const signer = await this.signer();
    const tippingContractId = publicRuntimeConfig.nearTippingContractId;
    const tipsBalanceInfo = {
      server_id: walletDetail.serverId,
      reference_type: walletDetail.referenceType,
      reference_id: walletDetail.referenceId,
      ft_identifier: walletDetail.ftIdentifier,
    };

    let maxAttachedGas = this.MAX_GAS;
    let receiverId = tippingContractId;
    let method = 'send_tip';
    let data = JSON.stringify({tips_balance_info: tipsBalanceInfo});
    let attachedAmount = amount;
    let initActions: nearAPI.transactions.Action[] = [];

    if (tokenContractId) {
      const contract = await this.contractInitialize(
        walletDetail.ftIdentifier,
        'storage_balance_of',
      );
      const isDeposit = await contract.storage_balance_of({account_id: tippingContractId});

      if (!isDeposit) {
        initActions = [
          nearAPI.transactions.functionCall(
            'storage_deposit',
            Buffer.from(JSON.stringify({account_id: tippingContractId})),
            this.ATTACHED_GAS,
            this.ATTACHED_AMOUNT,
          ),
        ];

        maxAttachedGas = maxAttachedGas.sub(this.ATTACHED_GAS);
      }

      receiverId = tokenContractId;
      method = 'ft_transfer_call';
      attachedAmount = this.ONE_YOCTO;
      data = JSON.stringify({
        receiver_id: tippingContractId,
        amount: amount.toString(),
        msg: JSON.stringify(tipsBalanceInfo),
      });
    }

    const actions = [
      ...initActions,
      nearAPI.transactions.functionCall(method, Buffer.from(data), maxAttachedGas, attachedAmount),
    ];

    //TODO: fix error protected class for multiple sign and send transactions
    // @ts-ignore: protected class
    await signer.signAndSendTransaction({receiverId, actions});

    return;
  }
}

export const getNearBalanceV2 = async (
  rpcURL: string,
  accountId: string,
  contractId?: string,
  decimal?: number,
): Promise<BalanceProps> => {
  const provider = new nearAPI.providers.JsonRpcProvider({url: rpcURL});
  try {
    if (contractId && decimal) {
      const data = JSON.stringify({account_id: accountId});
      const buff = Buffer.from(data);
      const base64data = buff.toString('base64');
      const result = await provider.query({
        request_type: 'call_function',
        account_id: contractId,
        method_name: 'ft_balance_of',
        args_base64: base64data,
        finality: 'final',
      });

      const balance: string = JSON.parse(Buffer.from((result as any).result).toString());

      return {balance: formatBalance(new BN(balance), decimal).toString()};
    }

    const nearAccount = await provider.query({
      request_type: 'view_account',
      account_id: accountId,
      finality: 'final',
    });

    const amount = (nearAccount as any).amount as string;
    const storage = nearAPI.utils.format.parseNearAmount('0.01854');
    const trxFee = nearAPI.utils.format.parseNearAmount('0.05');
    const result = new BN(amount).sub(new BN(storage)).sub(new BN(trxFee));
    const finalBalance = result.lte(new BN(storage)) ? '0' : result.toString();

    return {balance: nearAPI.utils.format.formatNearAmount(finalBalance)};
  } catch (err) {
    console.log(err);
    throw err;
  }
};
