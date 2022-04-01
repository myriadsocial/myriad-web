import {useSelector, useDispatch} from 'react-redux';

import {signIn, signOut} from 'next-auth/client';
import getConfig from 'next/config';

import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';

import {usePolkadotExtension} from 'src/hooks/use-polkadot-app.hook';
import {User} from 'src/interfaces/user';
import * as AuthAPI from 'src/lib/api/ext-auth';
import {WalletTypeEnum, NetworkTypeEnum} from 'src/lib/api/ext-auth';
import * as UserAPI from 'src/lib/api/user';
import * as WalletAPI from 'src/lib/api/wallet';
import {toHexPublicKey} from 'src/lib/crypto';
import {firebaseCloudMessaging} from 'src/lib/firebase';
import {createNearSignature} from 'src/lib/services/near-api-js';
import {signWithExtension} from 'src/lib/services/polkadot-js';
import {RootState} from 'src/reducers';
import {fetchUserWallets, fetchCurrentUserWallets} from 'src/reducers/user/actions';
import {UserState} from 'src/reducers/user/reducer';
import {uniqueNamesGenerator, adjectives, colors} from 'unique-names-generator';

type UserNonceProps = {
  nonce: number;
};

interface NearPayload {
  publicAddress: string;
  nearAddress: string;
  pubKey: string;
  signature: string;
}

export const useAuthHook = () => {
  const dispatch = useDispatch();
  const {user} = useSelector<RootState, UserState>(state => state.userState);
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
      const data = await WalletAPI.getUserNonce(nearId);

      return data;
    } catch (error) {
      console.log('[useAuthHook][getUserNonce][error]', {error});
      return {nonce: 0};
    }
  };

  const fetchUserNonce = async (account: InjectedAccountWithMeta): Promise<UserNonceProps> => {
    try {
      const data = await WalletAPI.getUserNonce(toHexPublicKey(account));

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
        publicAddress: toHexPublicKey(account),
        signature,
        walletType: WalletTypeEnum.POLKADOT,
        networkType: NetworkTypeEnum.POLKADOT,
        nonce,
        anonymous: false,
        callbackUrl: publicRuntimeConfig.appAuthURL,
      });

      return true;
    }

    if (nearAddress && nearAddress.length > 0) {
      const data = await createNearSignature(nearAddress, nonce);

      if (data && !data.signature) return null;

      if (data) {
        const parsedNearAddress = nearAddress.split('/')[1];
        signIn('credentials', {
          address: parsedNearAddress,
          publicAddress: data.publicAddress,
          signature: data.signature,
          walletType: WalletTypeEnum.NEAR,
          networkType: NetworkTypeEnum.NEAR,
          nonce,
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
  ): Promise<true | null> => {
    let nonce = null;

    switch (walletType) {
      case WalletTypeEnum.POLKADOT: {
        const data = await AuthAPI.signUp({
          address: id,
          name,
          username,
          type: WalletTypeEnum.POLKADOT,
          network: NetworkTypeEnum.POLKADOT,
        });

        if (data) nonce = data.nonce;

        if (nonce && nonce > 0 && account) {
          return signInWithExternalAuth(nonce, account);
        } else {
          return null;
        }
      }

      case WalletTypeEnum.NEAR: {
        const nearAddress = id.includes('/') ? id.split('/')[1] : id;
        const data = await AuthAPI.signUp({
          address: nearAddress,
          name,
          username,
          type: WalletTypeEnum.NEAR,
          network: NetworkTypeEnum.NEAR,
        });

        if (data) nonce = data.nonce;

        if (nonce && nonce > 0 && id) {
          return signInWithExternalAuth(nonce, undefined, id);
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
    const {nonce} = await WalletAPI.getUserNonce(address);

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

  const connectNetwork = async (account?: InjectedAccountWithMeta, nearAccount?: NearPayload) => {
    if (!user) return;

    try {
      const {nonce} = await WalletAPI.getUserNonceByUserId(user?.id);
      if (account) {
        const address = toHexPublicKey(account);
        const signature = await createSignaturePolkadotExt(account, nonce);
        const payload: WalletAPI.ConnectNetwork = {
          publicAddress: address,
          nonce,
          signature,
          networkType: NetworkTypeEnum.POLKADOT,
          walletType: WalletTypeEnum.POLKADOT,
          data: {
            id: address,
          },
        };

        await WalletAPI.connectNetwork(payload, user.id);
      } else if (nearAccount) {
        const payload: WalletAPI.ConnectNetwork = {
          publicAddress: nearAccount.pubKey,
          nonce,
          signature: nearAccount.signature,
          networkType: NetworkTypeEnum.NEAR,
          walletType: WalletTypeEnum.NEAR,
          data: {
            id: nearAccount.nearAddress,
          },
        };

        await WalletAPI.connectNetwork(payload, user.id);
      }

      dispatch(fetchUserWallets());
      dispatch(fetchCurrentUserWallets());
    } catch (error) {
      console.log(error);
    }
  };

  const switchNetwork = async (
    account?: InjectedAccountWithMeta,
    nearAccount?: NearPayload,
    callback?: () => void,
  ) => {
    if (!user) return;

    try {
      const {nonce} = await WalletAPI.getUserNonceByUserId(user?.id);
      if (account) {
        const address = toHexPublicKey(account);
        const signature = await createSignaturePolkadotExt(account, nonce);
        const payload: WalletAPI.ConnectNetwork = {
          publicAddress: address,
          nonce,
          signature,
          networkType: NetworkTypeEnum.POLKADOT,
          walletType: WalletTypeEnum.POLKADOT,
        };

        await WalletAPI.switchNetwork(payload, user.id);
      }
      if (nearAccount) {
        const payload: WalletAPI.ConnectNetwork = {
          publicAddress: nearAccount.publicAddress,
          nonce,
          signature: nearAccount.signature,
          networkType: NetworkTypeEnum.NEAR,
          walletType: WalletTypeEnum.NEAR,
        };

        await WalletAPI.switchNetwork(payload, user.id);
      }

      dispatch(fetchUserWallets());
      dispatch(fetchCurrentUserWallets());
      callback && callback();
    } catch (error) {
      console.log(error);
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
    connectNetwork,
    switchNetwork,
  };
};
