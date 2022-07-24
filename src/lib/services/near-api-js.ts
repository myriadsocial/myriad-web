import getConfig from 'next/config';

import {BN} from '@polkadot/util/bn';
import {numberToHex} from '@polkadot/util/number';
import {u8aToHex} from '@polkadot/util/u8a';

import assign from 'lodash/assign';
import * as nearAPI from 'near-api-js';
import {ConnectConfig, providers} from 'near-api-js';
import type {Signature} from 'near-api-js/lib/utils/key_pair';
import {formatBalance} from 'src/helpers/balance';
import {Network, NetworkIdEnum} from 'src/interfaces/network';
import {WalletTypeEnum} from 'src/interfaces/wallet';
import * as NetworkAPI from 'src/lib/api/network';
import * as WalletAPI from 'src/lib/api/wallet';

export type NearInitializeProps = {
  near: nearAPI.Near;
  wallet: nearAPI.WalletConnection;
};

export type NearConnectResponseProps = {
  nonce: number;
  publicAddress: string;
  signature: string;
};

export type NearSignatureProps = {
  signature: `0x${string}`;
  publicAddress: string;
};

export type NearBalanceProps = {
  balance: string;
};

export type ContractBalanceProps = {
  account_id: string;
};

export type ContractReceiverProps = {
  receiver_id: string;
  amount: string;
};

export type ContractStorageBalanceProps = {
  available: string;
  total: string;
};

export type ContractTipsBalanceInfoProps = {
  server_id: string;
  reference_type: string;
  reference_ids: string[];
  main_ref_type: string;
  main_ref_id: string;
};

interface TipBalanceInfo {
  server_id: string;
  reference_type: string;
  reference_id: string;
  ft_identifier: string;
}

interface TipsBalance {
  tips_balance_info: TipBalanceInfo;
  account_id: string;
  amount: string;
}

interface TipResult {
  formatted_amount: string;
  symbol: string;
  tips_balance: TipsBalance;
  unclaimed_reference_ids: string[];
}

interface Meta {
  current_page?: number;
  items_per_page: number;
  next_page?: number;
  previous_page?: number;
  total_item_count: number;
  total_page_count: number;
}

interface TipResultWithPagination {
  data: TipResult[];
  meta: Meta;
}

export type ContractProps = {
  ft_balance_of: (props: ContractBalanceProps) => string;
  ft_transfer: (
    contractReceiver: ContractReceiverProps,
    attachedGas: string,
    attachedAmount: string,
  ) => void;
  storage_balance_of: (props: ContractBalanceProps) => null | ContractStorageBalanceProps;
  storage_deposit: (props: ContractBalanceProps) => void;
  get_tips_balances: (props: ContractTipsBalanceInfoProps) => TipResultWithPagination;
};

export const connectNear = async (network: Network): Promise<NearInitializeProps> => {
  try {
    const {keyStores, connect, WalletConnection} = nearAPI;
    // creates keyStore using private key in local storage
    // *** REQUIRES SignIn using walletConnection.requestSignIn() ***
    const keyStore = new keyStores.BrowserLocalStorageKeyStore();

    // set config for near network
    const config: ConnectConfig = {
      networkId: network.chainId ?? 'testnet',
      keyStore,
      nodeUrl: network.rpcURL,
      walletUrl: network.walletURL,
      helperUrl: network.helperURL,
      headers: {},
    };

    const near = await connect(assign({deps: {keyStore}}, config));
    const wallet = new WalletConnection(near, 'myriad-social');
    return {near, wallet};
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const nearInitialize = async (): Promise<NearInitializeProps> => {
  try {
    const {keyStores, connect, WalletConnection} = nearAPI;
    // creates keyStore using private key in local storage
    // *** REQUIRES SignIn using walletConnection.requestSignIn() ***

    const keyStore = new keyStores.BrowserLocalStorageKeyStore();
    const network = await NetworkAPI.getNetwork(NetworkIdEnum.NEAR);

    // set config for near network
    const config: ConnectConfig = {
      networkId: network.chainId ?? 'testnet',
      keyStore,
      nodeUrl: network.rpcURL,
      walletUrl: network.walletURL,
      helperUrl: network.helperURL,
      headers: {},
    };

    const near = await connect(assign({deps: {keyStore}}, config));
    const wallet = new WalletConnection(near, 'myriad-social');
    return {near, wallet};
  } catch (error) {
    console.log({error});
    throw error;
  }
};

export const clearNearAccount = async () => {
  const {wallet} = await nearInitialize();
  const keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore();

  keyStore.clear();

  if (wallet.isSignedIn()) {
    wallet.signOut();
  }
};

export const connectToNearWallet = async (
  near: nearAPI.Near,
  wallet: nearAPI.WalletConnection,
  callbackUrl?: string,
  failedCallbackUrl?: string,
): Promise<NearConnectResponseProps | null> => {
  try {
    const {publicRuntimeConfig} = getConfig();

    const {keyStores} = nearAPI;
    // creates keyStore using private key in local storage
    // *** REQUIRES SignIn using walletConnection.requestSignIn() ***

    const keyStore = new keyStores.BrowserLocalStorageKeyStore();

    if (!wallet.isSignedIn()) {
      await wallet.requestSignIn({
        successUrl: callbackUrl ?? `${publicRuntimeConfig.appAuthURL}/?auth=${WalletTypeEnum.NEAR}`,
        failureUrl: failedCallbackUrl,
      });

      return null;
    } else {
      const address = wallet.getAccountId();
      const signer = new nearAPI.InMemorySigner(wallet._keyStore);
      const hasPublicKey = await signer.getPublicKey(address, wallet._networkId);

      if (!hasPublicKey) await signer.createKey(address, wallet._networkId);
      const keyPair = await keyStore.getKey(wallet._networkId, address);

      const {nonce} = await WalletAPI.getUserNonce(address);
      const userSignature: Signature = keyPair.sign(Buffer.from(numberToHex(nonce)));
      const publicKey = u8aToHex(userSignature.publicKey.data);
      const userSignatureHex = u8aToHex(userSignature.signature);

      const publicAddress = `${publicKey}/${address}`;
      const signature = userSignatureHex;

      return {nonce, publicAddress, signature};
    }
  } catch (error) {
    console.log({error});

    throw error;
  }
};

export const createNearSignature = async (
  nearAddress: string,
  nonce: number,
): Promise<NearSignatureProps | null> => {
  try {
    const {chainId} = await NetworkAPI.getNetwork(NetworkIdEnum.NEAR);
    const {keyStores} = nearAPI;
    // creates keyStore using private key in local storage
    // *** REQUIRES SignIn using walletConnection.requestSignIn() ***

    const keyStore = new keyStores.BrowserLocalStorageKeyStore();
    const keyPair = await keyStore.getKey(chainId ?? '', nearAddress);
    const userSignature: Signature = keyPair.sign(Buffer.from(numberToHex(nonce)));

    const publicKey = u8aToHex(userSignature.publicKey.data);
    const userSignatureHex = u8aToHex(userSignature.signature);

    const publicAddress = `${publicKey}/${nearAddress}`;

    return {signature: userSignatureHex, publicAddress};
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getNearBalance = async (
  near: nearAPI.Near,
  nearAddress: string,
  contractId?: string,
  decimal?: number,
): Promise<NearBalanceProps> => {
  try {
    if (contractId && decimal) {
      const contract = await contractInitialize(contractId);
      const contractBalance = await contract.ft_balance_of({account_id: nearAddress});
      return {balance: formatBalance(new BN(contractBalance), decimal).toString()};
    }

    const account = await near.account(nearAddress);
    const balance = await account.getAccountBalance();
    const reservedForTransaction = nearAPI.utils.format.parseNearAmount('0.05');
    const finalBalance =
      parseFloat(balance.available) <= parseFloat(reservedForTransaction)
        ? '0'
        : new BN(balance.available).sub(new BN(reservedForTransaction));
    return {balance: nearAPI.utils.format.formatNearAmount(finalBalance.toString())};
  } catch (error) {
    console.log({error});
    throw error;
  }
};

export const getNearBalanceV2 = async (
  rpcURL: string,
  accountId: string,
  contractId?: string,
  decimal?: number,
): Promise<NearBalanceProps> => {
  const provider = new providers.JsonRpcProvider({url: rpcURL});
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

export const getClaimTipNear = async (
  serverId: string,
  referenceId: string,
  referenceIds: string[],
): Promise<TipResultWithPagination> => {
  try {
    const {publicRuntimeConfig} = getConfig();
    const tippingContractId = publicRuntimeConfig.nearTippingContractId;
    const contract = await contractInitialize(tippingContractId);
    const tipsBalances = await contract.get_tips_balances({
      server_id: serverId,
      reference_type: 'people',
      reference_ids: referenceIds,
      main_ref_type: 'user',
      main_ref_id: referenceId,
    });

    return tipsBalances;
  } catch (error) {
    console.log({error});
  }

  return {
    data: [],
    meta: {
      current_page: null,
      items_per_page: null,
      next_page: null,
      previous_page: null,
      total_item_count: null,
      total_page_count: null,
    },
  };
};

export const contractInitialize = async (contractId: string): Promise<ContractProps> => {
  try {
    const {wallet} = await nearInitialize();
    const contract = new nearAPI.Contract(wallet.account(), contractId, {
      viewMethods: ['ft_balance_of', 'storage_balance_of', 'get_tips_balances'],
      changeMethods: ['ft_transfer', 'storage_deposit'],
    });
    //TODO: fix type for return all of the contract
    return contract as unknown as ContractProps;
  } catch (error) {
    console.log({error});
    throw error;
  }
};
