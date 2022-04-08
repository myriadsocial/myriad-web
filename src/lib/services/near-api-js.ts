import getConfig from 'next/config';

import {u8aToHex, numberToHex} from '@polkadot/util';

import {assign} from 'lodash';
import * as nearAPI from 'near-api-js';
import {ConnectConfig} from 'near-api-js';
import {Signature} from 'near-api-js/lib/utils/key_pair';
import {WalletTypeEnum, NetworkTypeEnum} from 'src/lib/api/ext-auth';
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

export const nearInitialize = async (): Promise<NearInitializeProps> => {
  try {
    const {keyStores, connect, WalletConnection} = nearAPI;
    // creates keyStore using private key in local storage
    // *** REQUIRES SignIn using walletConnection.requestSignIn() ***

    const keyStore = new keyStores.BrowserLocalStorageKeyStore();
    const network = await NetworkAPI.getNetwork(NetworkTypeEnum.NEAR);

    // set config for near network
    const config: ConnectConfig = {
      networkId: network.chainId ?? '',
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
): Promise<NearConnectResponseProps> => {
  try {
    const {publicRuntimeConfig} = getConfig();

    const {keyStores} = nearAPI;
    // creates keyStore using private key in local storage
    // *** REQUIRES SignIn using walletConnection.requestSignIn() ***

    const keyStore = new keyStores.BrowserLocalStorageKeyStore();

    if (!wallet.isSignedIn()) {
      await wallet.requestSignIn({
        successUrl: callbackUrl ?? `${publicRuntimeConfig.appAuthURL}/?auth=${WalletTypeEnum.NEAR}`,
      });
    }
    const address = wallet.getAccountId();

    const signer = new nearAPI.InMemorySigner(wallet._keyStore);
    const hasPublicKey = await signer.getPublicKey(address, wallet._networkId);

    if (!hasPublicKey) await signer.createKey(address, wallet._networkId);
    const keyPair = await keyStore.getKey(wallet._networkId, address);

    const {nonce} = await WalletAPI.getUserNonce(address);
    const userSignature: Signature = keyPair.sign(Buffer.from(numberToHex(nonce)));
    const publicKey = u8aToHex(userSignature.publicKey.data);
    const userSignatureHex = u8aToHex(userSignature.signature);
    const payload = {
      publicAddress: `${publicKey}/${address}`,
      nonce,
      signature: userSignatureHex,
      walletType: WalletTypeEnum.NEAR,
    };

    return {nonce, publicAddress: payload.publicAddress, signature: payload.signature};
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
    const {chainId} = await NetworkAPI.getNetwork(NetworkTypeEnum.NEAR);
    const {keyStores} = nearAPI;
    // creates keyStore using private key in local storage
    // *** REQUIRES SignIn using walletConnection.requestSignIn() ***

    const keyStore = new keyStores.BrowserLocalStorageKeyStore();

    // parse to wallet.near format
    const parsedNearAddress = nearAddress.split('/')[1];
    const keyPair = await keyStore.getKey(chainId ?? '', parsedNearAddress);
    const userSignature: Signature = keyPair.sign(Buffer.from(numberToHex(nonce)));

    const publicKey = u8aToHex(userSignature.publicKey.data);
    const userSignatureHex = u8aToHex(userSignature.signature);

    const publicAddress = `${publicKey}/${parsedNearAddress}`;

    return {signature: userSignatureHex, publicAddress};
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getNearBalance = async (
  near: nearAPI.Near,
  nearAddress: string,
): Promise<NearBalanceProps> => {
  try {
    const account = await near.account(nearAddress);
    const balance = await account.getAccountBalance();
    return {balance: nearAPI.utils.format.formatNearAmount(balance.available)};
  } catch (error) {
    console.log({error});
    throw error;
  }
};
