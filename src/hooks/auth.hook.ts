import {signIn, signOut} from 'next-auth/client';
import getConfig from 'next/config';

import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';

import {usePolkadotExtension} from 'src/hooks/use-polkadot-app.hook';
import {User} from 'src/interfaces/user';
import * as AuthAPI from 'src/lib/api/ext-auth';
import {WalletTypeEnum} from 'src/lib/api/ext-auth';
import * as UserAPI from 'src/lib/api/user';
import {toHexPublicKey} from 'src/lib/crypto';
import {firebaseCloudMessaging} from 'src/lib/firebase';
import {createNearSignature} from 'src/lib/services/near-api-js';
import {signWithExtension} from 'src/lib/services/polkadot-js';
import {uniqueNamesGenerator, adjectives, colors} from 'unique-names-generator';

type UserNonceProps = {
  nonce: number;
};

export const useAuthHook = () => {
  const {getPolkadotAccounts} = usePolkadotExtension();
  const {publicRuntimeConfig} = getConfig();

  const createSignaturePolkadotExt = async (
    account: InjectedAccountWithMeta,
    nonce: number,
  ): Promise<string | null> => {
    try {
      const signature = await signWithExtension(account, nonce);

      return signature;
    } catch (error) {
      console.log({error});
      return null;
    }
  };

  const fetchNearUserNonce = async (nearId: string): Promise<UserNonceProps> => {
    try {
      const data = await UserAPI.getUserNonce(nearId);

      return data;
    } catch (error) {
      console.log('[useAuthHook][getUserNonce][error]', {error});
      return {nonce: 0};
    }
  };

  const fetchUserNonce = async (account: InjectedAccountWithMeta): Promise<UserNonceProps> => {
    try {
      const data = await UserAPI.getUserNonce(toHexPublicKey(account));

      return data;
    } catch (error) {
      console.log('[useAuthHook][getUserNonce][error]', {error});
      return {nonce: 0};
    }
  };

  const getUserByAccounts = async (accounts: InjectedAccountWithMeta[]): Promise<User[] | null> => {
    try {
      const {data} = await UserAPI.getUserByAddress(accounts.map(toHexPublicKey));

      return data;
    } catch (error) {
      console.log('[useAuthHook][getUserByAccounts][error]', error);

      return [];
    }
  };

  const getRegisteredAccounts = async (): Promise<InjectedAccountWithMeta[]> => {
    const accounts = await getPolkadotAccounts();

    // TODO: UserAPI.getUserByAddress not working properly, uncomment this after api fixed
    // const users = await getUserByAccounts(accounts);

    // return accounts.filter(account => {
    //   return map(users, 'id').includes(toHexPublicKey(account));
    // });

    return accounts;
  };

  const signInWithExternalAuth = async (
    nonce: number,
    account?: InjectedAccountWithMeta,
    nearAddress?: string,
  ) => {
    if (account) {
      const signature = await createSignaturePolkadotExt(account, nonce);

      if (!signature) return null;

      signIn('credentials', {
        name: account.meta.name,
        address: toHexPublicKey(account),
        anonymous: false,
        callbackUrl: publicRuntimeConfig.appAuthURL,
        signature,
        nonce,
      });

      return true;
    }

    if (nearAddress) {
      const data = await createNearSignature(nearAddress, nonce);

      if (data && data.signature) return null;

      if (data) {
        signIn('credentials', {
          address: nearAddress,
          publicAddress: data.publicAddress,
          signature: data.signature,
          nonce,
          walletType: WalletTypeEnum.NEAR,
          anonymous: false,
          callbackUrl: publicRuntimeConfig.appAuthURL,
        });

        return true;
      }
    }

    return null;
  };

  const signUpWithExternalAuth = async (
    id: string,
    name: string,
    username: string,
    walletType: WalletTypeEnum,
    account?: InjectedAccountWithMeta,
    publicAddress?: string,
  ): Promise<true | null> => {
    let nonce = null;

    switch (walletType) {
      case WalletTypeEnum.POLKADOT: {
        const data = await AuthAPI.signUp({id, name, username});

        if (data) nonce = data.nonce;

        if (nonce && nonce > 0 && account) {
          return signInWithExternalAuth(nonce, account);
        } else {
          return null;
        }
      }

      case WalletTypeEnum.NEAR: {
        const nearAddress = id.includes('/') ? id.split('/')[1] : id;
        const data = await AuthAPI.signUp({id: nearAddress, name, username});

        if (data) nonce = data.nonce;

        if (nonce && nonce > 0 && publicAddress) {
          return signInWithExternalAuth(nonce, undefined, publicAddress);
        } else {
          return null;
        }
      }

      default:
        return null;
    }
  };

  const anonymous = async (): Promise<void> => {
    const name: string = uniqueNamesGenerator({
      dictionaries: [adjectives, colors],
      separator: ' ',
    });

    await signIn('credentials', {
      address: null,
      name: name,
      anonymous: true,
      callbackUrl: publicRuntimeConfig.appAuthURL,
    });
  };

  const switchAccount = async (account: InjectedAccountWithMeta) => {
    const address = toHexPublicKey(account);
    const {nonce} = await UserAPI.getUserNonce(address);

    if (nonce > 0) {
      await signInWithExternalAuth(nonce, account);
    } else {
      await firebaseCloudMessaging.removeToken();
      await signOut({
        callbackUrl: `${publicRuntimeConfig.appAuthURL}?address=${address}`,
        redirect: true,
      });
    }
  };

  const logout = async () => {
    await firebaseCloudMessaging.removeToken();
    await signOut({
      callbackUrl: publicRuntimeConfig.appAuthURL,
      redirect: true,
    });
  };

  return {
    anonymous,
    logout,
    getUserByAccounts,
    getRegisteredAccounts,
    fetchUserNonce,
    fetchNearUserNonce,
    signInWithExternalAuth,
    signUpWithExternalAuth,
    switchAccount,
  };
};
