import {signIn} from 'next-auth/client';
import getConfig from 'next/config';

import {u8aToHex, numberToHex} from '@polkadot/util';

import {assign} from 'lodash';
import * as nearAPI from 'near-api-js';
import {ConnectConfig} from 'near-api-js';
import {Signature} from 'near-api-js/lib/utils/key_pair';
import {WalletTypeEnum} from 'src/lib/api/ext-auth';
import * as UserAPI from 'src/lib/api/user';

export type NearConnectResponseProps = {
  nonce: number;
  publicAddress: string;
};

export type NearSignatureProps = {
  signature: `0x${string}`;
  publicAddress: string;
};

export const connectToNearWallet = async (): Promise<NearConnectResponseProps> => {
  try {
    const {keyStores, connect, WalletConnection} = nearAPI;
    // creates keyStore using private key in local storage
    // *** REQUIRES SignIn using walletConnection.requestSignIn() ***

    const keyStore = new keyStores.BrowserLocalStorageKeyStore();

    // set config for near testnet
    const config: ConnectConfig = {
      networkId: 'testnet',
      keyStore,
      nodeUrl: 'https://rpc.testnet.near.org',
      walletUrl: 'https://wallet.testnet.near.org',
      helperUrl: 'https://helper.testnet.near.org',
      headers: {},
    };

    const near = await connect(assign({deps: {keyStore}}, config));
    const wallet = new WalletConnection(near, 'myriad-social');

    if (!wallet.isSignedIn()) {
      await wallet.requestSignIn({successUrl: 'http://localhost:3000/'});
    }
    const address = wallet.getAccountId();

    const {publicRuntimeConfig} = getConfig();

    const signer = new nearAPI.InMemorySigner(wallet._keyStore);
    const hasPublicKey = await signer.getPublicKey(address, 'testnet');

    if (!hasPublicKey) await signer.createKey(address, 'testnet');
    const keyPair = await keyStore.getKey('testnet', address);

    const {nonce} = await UserAPI.getUserNonce(address);

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
      });
    }
    return {nonce, publicAddress: payload.publicAddress};
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
    const {keyStores} = nearAPI;
    // creates keyStore using private key in local storage
    // *** REQUIRES SignIn using walletConnection.requestSignIn() ***

    const keyStore = new keyStores.BrowserLocalStorageKeyStore();

    const keyPair = await keyStore.getKey('testnet', nearAddress);

    const userSignature: Signature = keyPair.sign(Buffer.from(numberToHex(nonce)));

    const publicKey = u8aToHex(userSignature.publicKey.data);
    const userSignatureHex = u8aToHex(userSignature.signature);

    const publicAddress = `${publicKey}/${nearAddress}`;

    return {signature: userSignatureHex, publicAddress};
  } catch (error) {
    console.log({error});
    return null;
  }
};
