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

type EncryptionPayload = {
  encryptedMessage: string;
  initVec: string;
};

export const encryptMessage = (message: string, secret: string): EncryptionPayload => {
  const algorithm = 'aes-256-cbc';

  // generate 16 bytes of random data
  const initVector = crypto.randomBytes(16).toString('hex').slice(0, 16);

  // the cipher function
  const cipher = crypto.createCipheriv(algorithm, secret, initVector);

  // encrypt the message
  // input encoding
  // output encoding
  let encryptedMessage = cipher.update(message, 'utf-8', 'hex');

  encryptedMessage += cipher.final('hex');

  const encryptionPayload = {
    encryptedMessage,
    initVec: initVector,
  };

  return encryptionPayload;
};

export const decryptMessage = (encrypted: string, secret: string, initVector: string): string => {
  const algorithm = 'aes-256-cbc';

  const decipher = crypto.createDecipheriv(algorithm, secret, initVector);

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
