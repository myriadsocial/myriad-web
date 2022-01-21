import {useDispatch} from 'react-redux';

import {signIn, signOut} from 'next-auth/client';
import getConfig from 'next/config';

import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';

import {map} from 'lodash';
import {usePolkadotExtension} from 'src/hooks/use-polkadot-app.hook';
import {User} from 'src/interfaces/user';
import * as AuthAPI from 'src/lib/api/ext-auth';
import * as UserAPI from 'src/lib/api/user';
import {toHexPublicKey} from 'src/lib/crypto';
import {firebaseCloudMessaging} from 'src/lib/firebase';
import {signWithExtension} from 'src/lib/services/polkadot-js';
import {setError} from 'src/reducers/base/actions';
import {uniqueNamesGenerator, adjectives, colors} from 'unique-names-generator';

type UserNonceProps = {
  nonce: number;
};

export const useAuthHook = () => {
  const {getPolkadotAccounts} = usePolkadotExtension();
  const {publicRuntimeConfig} = getConfig();

  const dispatch = useDispatch();

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

  const fetchUserNonce = async (
    account: InjectedAccountWithMeta,
  ): Promise<UserNonceProps | null> => {
    try {
      const data = await UserAPI.getUserNonce(toHexPublicKey(account));

      return data;
    } catch (error) {
      console.log('[useAuthHook][getUserNonce][error]', {error});
      return null;
    }
  };

  const getUserByAccounts = async (accounts: InjectedAccountWithMeta[]): Promise<User[] | null> => {
    try {
      console.log('accounts', accounts.map(toHexPublicKey));
      const {data} = await UserAPI.getUserByAddress(accounts.map(toHexPublicKey));
      console.log('users', data);
      return data;
    } catch (error) {
      console.log('[useAuthHook][getUserByAccounts][error]', error);

      return null;
    }
  };

  const getRegisteredAccounts = async (): Promise<InjectedAccountWithMeta[]> => {
    const accounts = await getPolkadotAccounts();

    const users = await getUserByAccounts(accounts);

    return accounts.filter(account => {
      return map(users, 'id').includes(toHexPublicKey(account));
    });
  };

  const loginWithExternalAuth = async (
    nonce: number,
    signature: string,
    account: InjectedAccountWithMeta,
  ) => {
    signIn('credentials', {
      name: account.meta.name,
      address: toHexPublicKey(account),
      anonymous: false,
      callbackUrl: publicRuntimeConfig.nextAuthURL,
      signature,
      nonce,
    });
  };

  const signUpWithExternalAuth = async (
    id: string,
    name: string,
    username: string,
    account: InjectedAccountWithMeta,
  ) => {
    let nonce = null;
    const data = await AuthAPI.signUp({id, name, username});

    if (data) nonce = data.nonce;

    if (nonce && nonce > 0) {
      const signature = await createSignaturePolkadotExt(account, nonce);

      if (signature) {
        await loginWithExternalAuth(nonce, signature, account);
      }
    }
  };

  const register = async (user: Partial<User>) => {
    try {
      const registered = await UserAPI.createUser(user);

      //await signIn('credentials', {
      //address: registered.id,
      //name: registered.name,
      //callbackUrl: publicRuntimeConfig.nextAuthURL,
      //});

      return registered;
    } catch (error) {
      console.log('[useAuthHook][register][error]', error);

      return false;
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
      callbackUrl: publicRuntimeConfig.nextAuthURL,
    });
  };

  //const signInWithAccount = (
  //account: InjectedAccountWithMeta,
  //name?: string,
  //username?: string,
  //) => {
  //signIn('credentials', {
  //address: toHexPublicKey(account),
  //name: name ?? account.meta.name,
  //username,
  //anonymous: false,
  //callbackUrl: publicRuntimeConfig.nextAuthURL,
  //});
  //};

  const login = async (username: string) => {
    const accounts = await getPolkadotAccounts();

    if (accounts.length === 0) {
      console.log('[useAuthHook][login][info]', 'No account found on polkadot extension');
      dispatch(
        setError({
          title: 'Login Error',
          message: 'No account found on polkadot extension',
        }),
      );

      return;
    }

    const users = await getUserByAccounts(accounts);

    if (!users || users.length === 0) {
      console.log('[useAuthHook][login][info]', 'No registered user match with polkadot accounts');

      dispatch(
        setError({
          title: 'Login Error',
          message: 'No registered user match with polkadot accounts',
        }),
      );

      return;
    }

    const selected = users.find(
      user => user.name.toLocaleLowerCase() === username.toLocaleLowerCase(),
    );

    if (selected) {
      //signIn('credentials', {
      //address: selected.id,
      //name: username,
      //anonymous,
      //callbackUrl: publicRuntimeConfig.nextAuthURL,
      //});
    } else {
      console.log('[useAuthHook][login][info]', 'No registered user matched with username');

      dispatch(
        setError({
          title: 'Login Error',
          message: 'No registered user matched with username',
        }),
      );

      return;
    }
  };

  const logout = async () => {
    await firebaseCloudMessaging.removeToken();
    await signOut({
      callbackUrl: publicRuntimeConfig.nextAuthURL,
      redirect: true,
    });
  };

  return {
    login,
    logout,
    //signInWithAccount,
    register,
    getUserByAccounts,
    getRegisteredAccounts,
    anonymous,
    fetchUserNonce,
    createSignaturePolkadotExt,
    loginWithExternalAuth,
    signUpWithExternalAuth,
  };
};
