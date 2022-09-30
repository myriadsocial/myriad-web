import {useSelector} from 'react-redux';

import {signIn, signOut} from 'next-auth/react';
import getConfig from 'next/config';

import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';

import useBlockchain from 'components/common/Blockchain/use-blockchain.hook';
import {usePolkadotExtension} from 'src/hooks/use-polkadot-app.hook';
import {MYRIAD_WALLET_KEY} from 'src/interfaces/blockchain-interface';
import {NetworkIdEnum} from 'src/interfaces/network';
import {WalletTypeEnum} from 'src/interfaces/wallet';
import * as AuthAPI from 'src/lib/api/ext-auth';
import * as WalletAPI from 'src/lib/api/wallet';
import {toHexPublicKey} from 'src/lib/crypto';
import * as FirebaseMessaging from 'src/lib/firebase/messaging';
import {Near} from 'src/lib/services/near-api-js';
import {PolkadotJs} from 'src/lib/services/polkadot-js';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';
import {uniqueNamesGenerator, adjectives, colors} from 'unique-names-generator';

type UserNonceProps = {
  nonce: number;
};

export const useAuthHook = () => {
  const {anonymous: anonymousUser, networks} = useSelector<RootState, UserState>(
    state => state.userState,
  );
  const {getPolkadotAccounts} = usePolkadotExtension();
  const {publicRuntimeConfig} = getConfig();
  const {provider} = useBlockchain();

  const fetchUserNonce = async (address: string): Promise<UserNonceProps> => {
    try {
      const data = await WalletAPI.getUserNonce(address);

      return data;
    } catch (error) {
      console.log('[useAuthHook][getUserNonce][error]', {error});
      return {nonce: 0};
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
    walletType?: WalletTypeEnum,
  ) => {
    if (account) {
      const signature = await PolkadotJs.signWithWallet(account, nonce);

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

      window.localStorage.setItem(MYRIAD_WALLET_KEY, walletType);

      return true;
    }

    if (nearAddress && nearAddress.length > 0) {
      const nearAccount = nearAddress.split('/')[1];
      const network = networks.find(network => network.id === NetworkIdEnum.NEAR);

      if (!network) return false;

      const near = await Near.connect(network, walletType);
      const wallet = near.provider.wallet;
      const data = await Near.signWithWallet(
        wallet,
        undefined,
        {nonce},
        'sign in with external auth',
      );

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

        window.localStorage.setItem(MYRIAD_WALLET_KEY, walletType);

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
    walletType?: WalletTypeEnum,
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
    return signInWithExternalAuth(networkId, nonce, account, id, walletType);
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

  const clearNearCache = async (): Promise<void> => {
    const nearNetwork = networks.find(network => network.id === NetworkIdEnum.NEAR);

    if (nearNetwork) {
      const near = await Near.connect(nearNetwork);
      return near?.disconnect();
    }
  };

  const logout = async (asUser?: boolean) => {
    window.localStorage.removeItem(MYRIAD_WALLET_KEY);

    const promises: Promise<void | undefined>[] = [
      signOut({
        callbackUrl: asUser
          ? publicRuntimeConfig.appAuthURL
          : publicRuntimeConfig.appAuthURL + '/login',
        redirect: true,
      }),
    ];

    if (!anonymousUser) {
      promises.unshift(FirebaseMessaging.unregister(), clearNearCache(), provider?.disconnect());
    }

    await Promise.all(promises);
  };

  return {
    anonymous,
    logout,
    clearNearCache,
    getRegisteredAccounts,
    fetchUserNonce,
    signInWithExternalAuth,
    signUpWithExternalAuth,
  };
};
