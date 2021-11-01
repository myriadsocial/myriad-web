import {useDispatch} from 'react-redux';

import {signIn, signOut} from 'next-auth/client';
import getConfig from 'next/config';

import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';

import {usePolkadotExtension} from 'src/hooks/use-polkadot-app.hook';
import {User} from 'src/interfaces/user';
import * as UserAPI from 'src/lib/api/user';
import {toHexPublicKey} from 'src/lib/crypto';
import {firebaseCloudMessaging} from 'src/lib/firebase';
import {setError} from 'src/reducers/base/actions';
import {uniqueNamesGenerator, adjectives, colors} from 'unique-names-generator';

export const useAuthHook = () => {
  const {getPolkadotAccounts} = usePolkadotExtension();
  const {publicRuntimeConfig} = getConfig();

  const dispatch = useDispatch();

  const getUserByAccounts = async (accounts: InjectedAccountWithMeta[]): Promise<User[] | null> => {
    try {
      console.log('accounts', accounts.map(toHexPublicKey));
      const users: User[] = await UserAPI.getUserByAddress(accounts.map(toHexPublicKey));
      console.log('users', users);
      return users;
    } catch (error) {
      console.log('[useAuthHook][getUserByAccounts][error]', error);

      return null;
    }
  };

  const register = async (user: Partial<User>) => {
    try {
      const registered = await UserAPI.createUser(user);

      await signIn('credentials', {
        address: registered.id,
        name: registered.name,
        callbackUrl: publicRuntimeConfig.nextAuthURL
          ? publicRuntimeConfig.nextAuthURL + '/welcome'
          : '/welcome',
      });

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
      callbackUrl: publicRuntimeConfig.nextAuthURL
        ? publicRuntimeConfig.nextAuthURL + '/welcome'
        : '/welcome',
    });
  };

  const signInWithAccount = (account: InjectedAccountWithMeta) => {
    signIn('credentials', {
      address: toHexPublicKey(account),
      name: account.meta.name,
      anonymous: false,
      callbackUrl: publicRuntimeConfig.nextAuthURL
        ? publicRuntimeConfig.nextAuthURL + '/welcome'
        : '/welcome',
    });
  };

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
      signIn('credentials', {
        address: selected.id,
        name: username,
        anonymous,
        callbackUrl: publicRuntimeConfig.nextAuthURL
          ? publicRuntimeConfig.nextAuthURL + '/welcome'
          : '/welcome',
      });
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
    signInWithAccount,
    register,
    anonymous,
  };
};
