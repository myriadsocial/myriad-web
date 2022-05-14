import * as Sentry from '@sentry/nextjs';

import {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {signIn, signOut} from 'next-auth/client';
import getConfig from 'next/config';

import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';

import {usePolkadotExtension} from 'src/hooks/use-polkadot-app.hook';
import {UserWallet} from 'src/interfaces/user';
import {User} from 'src/interfaces/user';
import {AccountRegisteredError} from 'src/lib/api/errors/account-registered.error';
import * as AuthAPI from 'src/lib/api/ext-auth';
import {WalletTypeEnum, NetworkTypeEnum} from 'src/lib/api/ext-auth';
import * as NetworkAPI from 'src/lib/api/network';
import * as UserAPI from 'src/lib/api/user';
import * as WalletAPI from 'src/lib/api/wallet';
import {toHexPublicKey} from 'src/lib/crypto';
import {firebaseCloudMessaging} from 'src/lib/firebase';
import {clearNearAccount} from 'src/lib/services/near-api-js';
import {createNearSignature} from 'src/lib/services/near-api-js';
import {signWithExtension} from 'src/lib/services/polkadot-js';
import {RootState} from 'src/reducers';
import {fetchBalances, getUserCurrencies} from 'src/reducers/balance/actions';
import {
  fetchUserWallets,
  fetchCurrentUserWallets,
  fetchUser,
  addNewWallet,
} from 'src/reducers/user/actions';
import {UserState} from 'src/reducers/user/reducer';
import {uniqueNamesGenerator, adjectives, colors} from 'unique-names-generator';

type UserNonceProps = {
  nonce: number;
};

export interface NearPayload {
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
  const [loading, setLoading] = useState(false);

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
    networkType: NetworkTypeEnum,
    nonce: number,
    account?: InjectedAccountWithMeta,
    nearAddress?: string,
  ): Promise<boolean | null> => {
    if (account) {
      const signature = await createSignaturePolkadotExt(account, nonce);

      if (!signature) return false;

      signIn('credentials', {
        name: account.meta.name,
        address: toHexPublicKey(account),
        publicAddress: toHexPublicKey(account),
        signature,
        walletType: WalletTypeEnum.POLKADOT,
        networkType: networkType,
        nonce,
        anonymous: false,
        callbackUrl: publicRuntimeConfig.appAuthURL,
      });

      return true;
    }

    if (nearAddress && nearAddress.length > 0) {
      const data = await createNearSignature(nearAddress, nonce);

      if (data && !data.signature) return false;

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

    return false;
  };

  const signUpWithExternalAuth = async (
    id: string,
    name: string,
    username: string,
    networkType: NetworkTypeEnum,
    account?: InjectedAccountWithMeta,
  ): Promise<boolean> => {
    let nonce = null;

    const [address, nearAddress] = id.split('/');
    const data = await AuthAPI.signUp({
      address: nearAddress ?? address,
      name,
      username,
      network: networkType,
    });

    if (data) nonce = data.nonce;
    if (!nonce) return false;
    return signInWithExternalAuth(networkType, nonce, account, id);
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

  const connectNetwork = async (account?: InjectedAccountWithMeta, nearAccount?: NearPayload) => {
    if (!user) return;

    try {
      const {nonce} = await WalletAPI.getUserNonceByUserId(user?.id);
      let payload = null;
      let currentAddress = null;

      if (account) {
        const address = toHexPublicKey(account);
        const signature = await createSignaturePolkadotExt(account, nonce);
        currentAddress = address;
        payload = {
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
        const result = await createNearSignature(`/${nearAccount.nearAddress}`, nonce);
        currentAddress = nearAccount.nearAddress;
        payload = {
          publicAddress: nearAccount.pubKey,
          nonce,
          signature: nearAccount.signature,
          networkType: NetworkTypeEnum.NEAR,
          walletType: WalletTypeEnum.NEAR,
          data: {
            id: nearAccount.nearAddress,
          },
        };

        if (result) payload.signature = result.signature;

        await WalletAPI.connectNetwork(payload, user.id);
      }

      if (payload && currentAddress) {
        const network = await NetworkAPI.getNetwork(payload.networkType);
        dispatch(
          addNewWallet({
            id: currentAddress,
            type: payload.walletType,
            networkId: payload.networkType,
            primary: false,
            userId: user.id,
            network: network,
          }),
        );
      }
    } catch (error) {
      if (error instanceof AccountRegisteredError) {
        throw error;
      } else {
        Sentry.captureException(error);
      }
    }
  };

  const switchNetwork = async (
    account: InjectedAccountWithMeta | NearPayload,
    networkType: NetworkTypeEnum,
    blockchainPlatform: string,
    callback?: () => void,
  ) => {
    if (!user) return;

    setLoading(true);

    try {
      const {nonce} = await WalletAPI.getUserNonceByUserId(user?.id);

      let payload: WalletAPI.ConnectNetwork;
      let currentAddress: string;

      switch (blockchainPlatform) {
        case 'substrate': {
          const polkadotAccount = account as InjectedAccountWithMeta;
          const signature = await createSignaturePolkadotExt(polkadotAccount, nonce);

          currentAddress = toHexPublicKey(polkadotAccount);
          payload = {
            publicAddress: currentAddress,
            nonce,
            signature,
            networkType: networkType,
            walletType: WalletTypeEnum.POLKADOT,
          };

          break;
        }

        case 'near': {
          const nearAccount = account as NearPayload;
          currentAddress = nearAccount.nearAddress;
          payload = {
            publicAddress: nearAccount.publicAddress,
            nonce,
            signature: nearAccount.signature,
            networkType: networkType,
            walletType: WalletTypeEnum.NEAR,
          };

          break;
        }

        default:
          throw new Error('Network not exists');
      }

      await WalletAPI.switchNetwork(payload, user.id);
      await dispatch(fetchUser(currentAddress));
      await Promise.all([
        dispatch(getUserCurrencies()),
        dispatch(fetchUserWallets()),
        dispatch(fetchCurrentUserWallets()),
      ]);

      await dispatch(fetchBalances());

      callback && callback();
    } catch (error) {
      if (error instanceof AccountRegisteredError) {
        throw error;
      } else {
        console.log(error);
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async (currentWallet?: UserWallet) => {
    if (currentWallet?.networkId === NetworkTypeEnum.NEAR) {
      await clearNearAccount();
    }

    await firebaseCloudMessaging.removeToken();
    await signOut({
      callbackUrl: publicRuntimeConfig.appAuthURL,
      redirect: true,
    });
  };

  return {
    loading,
    anonymous,
    logout,
    getUserByAccounts,
    getRegisteredAccounts,
    fetchUserNonce,
    fetchNearUserNonce,
    signInWithExternalAuth,
    signUpWithExternalAuth,
    connectNetwork,
    switchNetwork,
  };
};
