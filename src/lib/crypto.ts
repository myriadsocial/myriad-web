import getConfig from 'next/config';

import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';
import {Keyring, decodeAddress} from '@polkadot/keyring';
import type {KeyringPair} from '@polkadot/keyring/types';
import {u8aToHex} from '@polkadot/util';
import {mnemonicGenerate} from '@polkadot/util-crypto';

import crypto from 'crypto';

type KeyDetail = {
  mnemonic: string;
  key: string;
};

export type EncryptionPayload = {
  encryptedMessage: string;
  iv: string;
};

const {serverRuntimeConfig} = getConfig();

export const encryptMessage = (message: string, address: string): EncryptionPayload => {
  const algorithm = 'aes-256-cbc';
  // generate 16 bytes of random data
  const iv = address.slice(0, 16).padEnd(16, '0');
  // the cipher function
  const cipher = crypto.createCipheriv(algorithm, serverRuntimeConfig.appSecret, iv);

  // encrypt the message
  // input encoding
  // output encoding
  let encryptedMessage = cipher.update(message, 'utf-8', 'hex');

  encryptedMessage += cipher.final('hex');

  const encryptionPayload = {
    encryptedMessage,
    iv,
  };

  return encryptionPayload;
};

export const decryptMessage = (encrypted: string, address: string): string => {
  const algorithm = 'aes-256-cbc';
  // generate 16 bytes of random data
  const iv = address.slice(0, 16).padEnd(16, '0');

  const decipher = crypto.createDecipheriv(algorithm, serverRuntimeConfig.appSecret, iv);

  let decryptedMessage = decipher.update(encrypted, 'hex', 'utf-8');

  decryptedMessage += decipher.final('utf-8');

  return decryptedMessage;
};

export const toHexPublicKey = (account: InjectedAccountWithMeta): string => {
  return u8aToHex(decodeAddress(account.address));
};

export const generateKey = (name: string): KeyDetail => {
  const derivationPath = '';

  const keyring = new Keyring();
  const seed = mnemonicGenerate();

  const pair: KeyringPair = keyring.createFromUri(seed + derivationPath, {name: name});
  const hexPublicKey = u8aToHex(pair.publicKey);

  return {
    mnemonic: seed,
    key: hexPublicKey,
  };
};
