import getConfig from 'next/config';

import {BN, u8aToHex, numberToHex} from '@polkadot/util';

import {assign} from 'lodash';
import * as nearAPI from 'near-api-js';
import {ConnectConfig} from 'near-api-js';
import {Signature} from 'near-api-js/lib/utils/key_pair';
import {formatBalance} from 'src/helpers/balance';
import {NetworkIdEnum} from 'src/interfaces/network';
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

export type ContractProps = {
  ft_balance_of: (props: ContractBalanceProps) => string;
  ft_transfer: (
    contractReceiver: ContractReceiverProps,
    attachedGas: string,
    attachedAmount: string,
  ) => void;
  storage_balance_of: (props: ContractBalanceProps) => null | ContractStorageBalanceProps;
  storage_deposit: (props: ContractBalanceProps) => void;
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
    const account = await near.account(nearAddress);
    if (contractId && decimal) {
      const contract = await contractInitialize(contractId);
      const contractBalance = await contract.ft_balance_of({account_id: nearAddress});
      return {balance: formatBalance(new BN(contractBalance), decimal).toString()};
    }
    const balance = await account.getAccountBalance();
    return {balance: nearAPI.utils.format.formatNearAmount(balance.available)};
  } catch (error) {
    console.log({error});
    throw error;
  }
};

export const contractInitialize = async (contractId: string): Promise<ContractProps> => {
  try {
    const {wallet} = await nearInitialize();
    const contract = new nearAPI.Contract(wallet.account(), contractId, {
      viewMethods: ['ft_balance_of', 'storage_balance_of'],
      changeMethods: ['ft_transfer', 'storage_deposit'],
    });
    //TODO: fix type for return all of the contract
    return contract as unknown as ContractProps;
  } catch (error) {
    console.log({error});
    throw error;
  }
};
