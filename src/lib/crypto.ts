import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';
import {Keyring, decodeAddress} from '@polkadot/keyring';
import type {KeyringPair} from '@polkadot/keyring/types';
import {u8aToHex, stringToU8a, u8aToString} from '@polkadot/util';
import {mnemonicGenerate, naclDecrypt, naclEncrypt} from '@polkadot/util-crypto';

type KeyDetail = {
  mnemonic: string;
  key: string;
};

type EncryptionPayload = {
  encryptedString: string;
  nonce: Uint8Array;
};

export const encryptMessage = (message: string, secret: string): EncryptionPayload => {
  const messagePreEncryption = stringToU8a(message);
  const modifiedSecret = stringToU8a(secret);

  // Encrypt the message
  const {encrypted, nonce} = naclEncrypt(messagePreEncryption, modifiedSecret);

  // Show contents of the encrypted message
  //console.log(`Encrypted message: ${JSON.stringify(encrypted, null, 2)}`);

  // Convert each Uint8Array to a string for comparison
  //const isMatch = u8aToString(messagePreEncryption) === u8aToString(messageDecrypted);

  // Verify that the decrypted message matches the original message
  //console.log(`Does the decrypted message match the original message? ${isMatch}`);
  const encryptedString = JSON.stringify(encrypted, null, 2);

  const encryptionPayload = {
    encryptedString,
    nonce,
  };

  return encryptionPayload;
};

export const decryptMessage = (
  encrypted: Uint8Array,
  nonce: Uint8Array,
  secret: Uint8Array,
): string => {
  // Decrypt the message
  const messageDecrypted = naclDecrypt(encrypted, nonce, secret);

  const decryptedString = u8aToString(messageDecrypted);

  return decryptedString;
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
