import {signIn, signOut} from 'next-auth/client';
import getConfig from 'next/config';

import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';

import {usePolkadotExtension} from 'src/hooks/use-polkadot-app.hook';
import {User} from 'src/interfaces/user';
import * as AuthAPI from 'src/lib/api/ext-auth';
import * as UserAPI from 'src/lib/api/user';
import {toHexPublicKey} from 'src/lib/crypto';
import {firebaseCloudMessaging} from 'src/lib/firebase';
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

  const signInWithExternalAuth = async (account: InjectedAccountWithMeta, nonce: number) => {
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
  };

  const signUpWithExternalAuth = async (
    id: string,
    name: string,
    username: string,
    account: InjectedAccountWithMeta,
  ): Promise<true | null> => {
    let nonce = null;
    const data = await AuthAPI.signUp({id, name, username});

    if (data) nonce = data.nonce;

    if (nonce && nonce > 0) {
      return signInWithExternalAuth(account, nonce);
    } else {
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
      await signInWithExternalAuth(account, nonce);
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
    signInWithExternalAuth,
    signUpWithExternalAuth,
    switchAccount,
  };
};
