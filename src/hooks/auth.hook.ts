import * as Sentry from '@sentry/nextjs';

import {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {signIn, signOut} from 'next-auth/react';
import getConfig from 'next/config';

import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';
import {isHex} from '@polkadot/util';

import {usePolkadotExtension} from 'src/hooks/use-polkadot-app.hook';
import {NetworkIdEnum} from 'src/interfaces/network';
import {UserWallet} from 'src/interfaces/user';
import {User} from 'src/interfaces/user';
import {BlockchainPlatform, WalletTypeEnum} from 'src/interfaces/wallet';
import {AccountRegisteredError} from 'src/lib/api/errors/account-registered.error';
import * as AuthAPI from 'src/lib/api/ext-auth';
import * as UserAPI from 'src/lib/api/user';
import * as WalletAPI from 'src/lib/api/wallet';
import {toHexPublicKey} from 'src/lib/crypto';
import {firebaseCloudMessaging} from 'src/lib/firebase';
import {clearNearAccount} from 'src/lib/services/near-api-js';
import {createNearSignature} from 'src/lib/services/near-api-js';
import {signWithExtension} from 'src/lib/services/polkadot-js';
import {RootState} from 'src/reducers';
import {fetchBalances} from 'src/reducers/balance/actions';
import {fetchUserWallets, fetchUser} from 'src/reducers/user/actions';
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

  const fetchUserNonce = async (address: string): Promise<UserNonceProps> => {
    try {
      const data = await WalletAPI.getUserNonce(address);

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
    networkId: NetworkIdEnum,
    nonce: number,
    account?: InjectedAccountWithMeta,
    nearAddress?: string,
  ) => {
    if (account) {
      const signature = await signWithExtension(account, nonce);

      if (!signature) return false;

      signIn('credentials', {
        name: account.meta.name,
        address: toHexPublicKey(account),
        publicAddress: toHexPublicKey(account),
        signature,
        walletType: WalletTypeEnum.POLKADOT,
        networkId: networkId,
        nonce,
        anonymous: false,
        callbackUrl: publicRuntimeConfig.appAuthURL,
      });

      return true;
    }

    if (nearAddress && nearAddress.length > 0) {
      const nearAccount = nearAddress.split('/')[1];
      const data = await createNearSignature(nearAccount, nonce);

      if (data && !data.signature) return false;

      if (data) {
        signIn('credentials', {
          address: nearAccount,
          publicAddress: data.publicAddress,
          signature: data.signature,
          walletType: WalletTypeEnum.NEAR,
          networkId: NetworkIdEnum.NEAR,
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
    networkId: NetworkIdEnum,
    account?: InjectedAccountWithMeta,
  ): Promise<boolean> => {
    let nonce = null;

    const [address, nearAddress] = id.split('/');
    const data = await AuthAPI.signUp({
      address: nearAddress ?? address,
      name,
      username,
      network: networkId,
    });

    if (data) nonce = data.nonce;
    if (!nonce) return false;
    return signInWithExternalAuth(networkId, nonce, account, id);
  };

  const anonymous = async (): Promise<void> => {
    const name: string = uniqueNamesGenerator({
      dictionaries: [adjectives, colors],
      separator: ' ',
    });
    const regex = /black|white/gi;

    await signIn('credentials', {
      address: null,
      name: name.replace(regex, 'gray'),
      anonymous: true,
      callbackUrl: publicRuntimeConfig.appAuthURL,
    });
  };

  const connectNetwork = async (
    blockchainPlatform: BlockchainPlatform,
    account?: InjectedAccountWithMeta | NearPayload,
  ): Promise<boolean> => {
    if (!user) return false;
    if (!account) return false;
    const {nonce} = await WalletAPI.getUserNonceByUserId(user?.id);

    if (!nonce) return false;

    try {
      let payload = null;

      switch (blockchainPlatform) {
        case BlockchainPlatform.SUBSTRATE:
          const polkadotAccount = account as InjectedAccountWithMeta;
          const polkadotSignature = await signWithExtension(polkadotAccount, nonce);

          if (!polkadotSignature) return false;

          const polkadotAddress = toHexPublicKey(polkadotAccount);

          payload = {
            publicAddress: polkadotAddress,
            nonce,
            signature: polkadotSignature,
            networkType: NetworkIdEnum.POLKADOT,
            walletType: WalletTypeEnum.POLKADOT,
            data: {
              id: polkadotAddress,
            },
          };

          break;

        case BlockchainPlatform.NEAR:
          const nearAccount = account as NearPayload;
          const result = await createNearSignature(nearAccount.nearAddress, nonce);

          if (!result) return false;

          const nearSignature = result.signature;
          const {pubKey, nearAddress} = nearAccount;

          payload = {
            publicAddress: pubKey,
            nonce,
            signature: nearSignature,
            networkType: NetworkIdEnum.NEAR,
            walletType: WalletTypeEnum.NEAR,
            data: {
              id: isHex(`0x${nearAddress}`) ? `0x${nearAddress}` : nearAddress,
            },
          };

          break;
      }

      if (!payload) return false;

      await WalletAPI.connectNetwork(payload, user.id);

      dispatch(fetchUserWallets());

      return true;
    } catch (err) {
      if (err instanceof AccountRegisteredError) {
        throw err;
      } else {
        Sentry.captureException(err);
      }
    }

    return false;
  };

  const switchNetwork = async (
    blockchainPlatform: BlockchainPlatform,
    networkId: NetworkIdEnum,
    account: InjectedAccountWithMeta | NearPayload,
    callback?: () => void,
  ) => {
    if (!user) return;

    setLoading(true);

    try {
      const {nonce} = await WalletAPI.getUserNonceByUserId(user?.id);

      let payload: WalletAPI.ConnectNetwork;
      let currentAddress: string;

      switch (blockchainPlatform) {
        case BlockchainPlatform.SUBSTRATE: {
          const polkadotAccount = account as InjectedAccountWithMeta;
          const signature = await signWithExtension(polkadotAccount, nonce, ({signerOpened}) => {
            if (signerOpened) setLoading(true);
          });

          if (!signature) return;

          currentAddress = toHexPublicKey(polkadotAccount);
          payload = {
            publicAddress: currentAddress,
            nonce,
            signature,
            networkType: networkId,
            walletType: WalletTypeEnum.POLKADOT,
          };

          break;
        }

        case BlockchainPlatform.NEAR: {
          const nearAccount = account as NearPayload;
          currentAddress = nearAccount.nearAddress;
          payload = {
            publicAddress: nearAccount.publicAddress,
            nonce,
            signature: nearAccount.signature,
            networkType: networkId,
            walletType: WalletTypeEnum.NEAR,
          };

          break;
        }

        default:
          throw new Error('Network not exists');
      }

      await WalletAPI.switchNetwork(payload, user.id);
      //TODO: better if joined in one API call
      await dispatch(fetchUser(currentAddress));
      await Promise.all([dispatch(fetchBalances(true)), dispatch(fetchUserWallets())]);

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
    if (currentWallet?.networkId === NetworkIdEnum.NEAR) {
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
    signInWithExternalAuth,
    signUpWithExternalAuth,
    connectNetwork,
    switchNetwork,
  };
};
