import {useSelector} from 'react-redux';

import {signIn, signOut} from 'next-auth/react';
import getConfig from 'next/config';

import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';

import useBlockchain from 'components/common/Blockchain/use-blockchain.hook';
import {usePolkadotExtension} from 'src/hooks/use-polkadot-app.hook';
import {NetworkIdEnum} from 'src/interfaces/network';
import {User} from 'src/interfaces/user';
import {WalletTypeEnum} from 'src/interfaces/wallet';
import * as AuthAPI from 'src/lib/api/ext-auth';
import * as UserAPI from 'src/lib/api/user';
import * as WalletAPI from 'src/lib/api/wallet';
import {toHexPublicKey} from 'src/lib/crypto';
import * as FirebaseMessaging from 'src/lib/firebase/messaging';
import {BlockchainProvider} from 'src/lib/services/blockchain-provider';
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

      return true;
    }

    if (nearAddress && nearAddress.length > 0) {
      const nearAccount = nearAddress.split('/')[1];
      const network = networks.find(network => network.id === NetworkIdEnum.NEAR);

      if (!network) return false;

      const near = await Near.connect(network);
      const wallet = near.provider.wallet;
      const data = await Near.signWithWallet(wallet);

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

  const logout = async () => {
    if (!anonymousUser) {
      await FirebaseMessaging.unregister();
    }

    if (provider.constructor.name !== 'Near') {
      const nearNetwork = networks.find(network => network.id === NetworkIdEnum.NEAR);

      if (nearNetwork) {
        const near = await Near.connect(nearNetwork);
        await near.disconnect();
      }
    }

    await provider?.disconnect();
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
  };
};
