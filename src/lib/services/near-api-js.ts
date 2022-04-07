import {signIn} from 'next-auth/client';
import getConfig from 'next/config';

import {u8aToHex, numberToHex} from '@polkadot/util';

import {assign} from 'lodash';
import * as nearAPI from 'near-api-js';
import {ConnectConfig} from 'near-api-js';
import {Signature} from 'near-api-js/lib/utils/key_pair';
import {WalletTypeEnum, NetworkTypeEnum} from 'src/lib/api/ext-auth';
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
    const {publicRuntimeConfig} = getConfig();
    const {keyStores, connect, WalletConnection} = nearAPI;
    // creates keyStore using private key in local storage
    // *** REQUIRES SignIn using walletConnection.requestSignIn() ***

    const keyStore = new keyStores.BrowserLocalStorageKeyStore();

    // set config for near network
    const config: ConnectConfig = {
      networkId: publicRuntimeConfig.nearNetworkId,
      keyStore,
      nodeUrl: publicRuntimeConfig.nearNodeUrl,
      walletUrl: publicRuntimeConfig.nearWalletUrl,
      helperUrl: publicRuntimeConfig.nearHelperUrl,
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

export const getWalletDetail = async (): Promise<{
  nonce: number;
  address: any;
  publicKey: any;
  signature: any;
}> => {
  const {publicRuntimeConfig} = getConfig();
  const {wallet} = await nearInitialize();
  const {keyStores} = nearAPI;

  const address = wallet.getAccountId();
  const {nonce} = await WalletAPI.getUserNonce(address);
  const keyStore = new keyStores.BrowserLocalStorageKeyStore();
  const keyPair = await keyStore.getKey(publicRuntimeConfig.nearNetworkId, address);
  const userSignature: Signature = keyPair.sign(Buffer.from(numberToHex(nonce)));

  return {
    nonce,
    address,
    publicKey: u8aToHex(userSignature.publicKey.data),
    signature: u8aToHex(userSignature.signature),
  };
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
        successUrl: callbackUrl ?? `${publicRuntimeConfig.appAuthURL}/?auth=near`,
      });
    }
    const address = wallet.getAccountId();

    const signer = new nearAPI.InMemorySigner(wallet._keyStore);
    const hasPublicKey = await signer.getPublicKey(address, publicRuntimeConfig.nearNetworkId);

    if (!hasPublicKey) await signer.createKey(address, publicRuntimeConfig.nearNetworkId);
    const keyPair = await keyStore.getKey(publicRuntimeConfig.nearNetworkId, address);

    const {nonce} = await WalletAPI.getUserNonce(address);

    let payload = {
      publicAddress: '',
      nonce: 0,
      signature: '',
      walletType: WalletTypeEnum.NEAR,
    };

    const userSignature: Signature = keyPair.sign(Buffer.from(numberToHex(nonce)));
    const publicKey = u8aToHex(userSignature.publicKey.data);
    const userSignatureHex = u8aToHex(userSignature.signature);

    payload = {
      publicAddress: `${publicKey}/${address}`,
      nonce,
      signature: userSignatureHex,
      walletType: WalletTypeEnum.NEAR,
    };

    if (nonce > 0) {
      signIn('credentials', {
        name: address,
        address: address,
        publicAddress: payload.publicAddress,
        anonymous: false,
        callbackUrl: publicRuntimeConfig.appAuthURL,
        signature: payload.signature,
        nonce: payload.nonce,
        walletType: payload.walletType,
        networkType: NetworkTypeEnum.NEAR,
      });
    }
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
    const {publicRuntimeConfig} = getConfig();

    const {keyStores} = nearAPI;
    // creates keyStore using private key in local storage
    // *** REQUIRES SignIn using walletConnection.requestSignIn() ***

    const keyStore = new keyStores.BrowserLocalStorageKeyStore();

    // parse to wallet.near format
    const parsedNearAddress = nearAddress.split('/')[1];
    console.log('PARSED NEAR ADDRESS', parsedNearAddress);
    console.log('nearNetworkId', publicRuntimeConfig.nearNetworkId);

    const keyPair = await keyStore.getKey(publicRuntimeConfig.nearNetworkId, parsedNearAddress);
    console.log('keyPair', keyPair);
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

export const sendTipsNear = async (
  near: nearAPI.Near,
  senderNearAddress: string,
  receiverNearAddress: string,
  amount: string,
): Promise<void> => {
  try {
    console.log(amount);
    // const account = await near.account(senderNearAddress);
    const test = nearAPI.utils.format.parseNearAmount(amount);
    console.log(test);
    // const balance = await account.getAccountBalance();
    // await account.sendMoney(
    //   receiverNearAddress,
    //   balance.available
    // )
    // let sendAmount = new BN(nearAPI.utils.format.parseNearAmount(amount));
    // await account.sendMoney(
    //   receiverNearAddress,
    //   sendAmount // amount in yoctoNEAR
    // );
  } catch (error) {
    console.log({error});
    throw error;
  }
};
