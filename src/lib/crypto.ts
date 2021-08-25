import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';
import {Keyring, decodeAddress} from '@polkadot/keyring';
import type {KeyringPair} from '@polkadot/keyring/types';
import {u8aToHex} from '@polkadot/util';
import {mnemonicGenerate} from '@polkadot/util-crypto';

type KeyDetail = {
  mnemonic: string;
  key: string;
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
