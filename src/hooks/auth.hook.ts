import {useCookies} from 'react-cookie';
import {useSelector} from 'react-redux';

import {signIn, signOut, SignOutResponse} from 'next-auth/react';
import getConfig from 'next/config';

import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';

import {COOKIE_INSTANCE_URL} from 'components/SelectServer';
import useBlockchain from 'components/common/Blockchain/use-blockchain.hook';
import {usePolkadotExtension} from 'src/hooks/use-polkadot-app.hook';
import {Network, NetworkIdEnum} from 'src/interfaces/network';
import {WalletWithSigner} from 'src/interfaces/user';
import {WalletTypeEnum} from 'src/interfaces/wallet';
import * as AuthAPI from 'src/lib/api/ext-auth';
import * as WalletAPI from 'src/lib/api/wallet';
import {toHexPublicKey} from 'src/lib/crypto';
import * as FirebaseMessaging from 'src/lib/firebase/messaging';
import {Near} from 'src/lib/services/near-api-js';
import {PolkadotJs} from 'src/lib/services/polkadot-js';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

type UserNonceProps = {
  nonce: number;
};

type UseAuthHooksArgs = {
  redirect?: string | string[];
};

export const useAuthHook = ({redirect}: UseAuthHooksArgs = {}) => {
  const {anonymous: anonymousUser, networks} = useSelector<RootState, UserState>(
    state => state.userState,
  );
  const {getPolkadotAccounts} = usePolkadotExtension();
  const {publicRuntimeConfig} = getConfig();
  const {provider} = useBlockchain();

  const [cookies] = useCookies([COOKIE_INSTANCE_URL]);

  const fetchUserNonce = async (address: string, apiURL?: string): Promise<UserNonceProps> => {
    try {
      const data = await WalletAPI.getUserNonce(address, apiURL);

      return data;
    } catch (error) {
      console.error('[useAuthHook][getUserNonce][error]', {error});
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
    nonce: number,
    wallet: WalletWithSigner,
    network: Network,
  ) => {
    let signInCredential = {
      nonce,
      networkType: network.id,
      walletType: wallet.type,
      blockchainPlatform: network.blockchainPlatform,
      instanceURL: cookies[COOKIE_INSTANCE_URL],
    };

    switch (wallet.type) {
      case WalletTypeEnum.POLKADOT: {
        if (!wallet.signer) return false;
        const signature = await PolkadotJs.signWithWallet(wallet.signer, nonce);
        if (!signature) return false;
        const address = toHexPublicKey(wallet.signer);
        const userSignature = {address, publicAddress: address, signature};
        signInCredential = {...signInCredential, ...userSignature};
        break;
      }

      case WalletTypeEnum.NEAR:
      case WalletTypeEnum.MYNEAR: {
        const nearAccount = wallet.id.split('/')[1];
        const near = await Near.connect(network, wallet.type);
        const nearWallet = near.provider.wallet;
        const data = await Near.signWithWallet(nearWallet, undefined, {nonce});
        if (!data?.signature) return false;
        const userSignature = {
          address: nearAccount,
          publicAddress: data.publicAddress,
          signature: data.signature,
        };
        signInCredential = {...signInCredential, ...userSignature};
        break;
      }

      default:
        return false;
    }

    const callbackUrl = redirect ?? publicRuntimeConfig.appAuthURL;
    signIn('credentials', {...signInCredential, callbackUrl});
    return true;
  };

  const signUpWithExternalAuth = async (
    name: string,
    username: string,
    wallet: WalletWithSigner,
    network: Network,
  ): Promise<boolean> => {
    let nonce = null;

    const [address, nearAddress] = wallet.id.split('/');
    const data = await AuthAPI.signUp({
      address: nearAddress ?? address,
      name,
      username,
      network: network.id,
    });

    if (data) nonce = data.nonce;
    if (!nonce) return false;
    return signInWithExternalAuth(nonce, wallet, network);
  };

  const clearNearCache = async (): Promise<void> => {
    const nearNetwork = networks.find(network => network.id === NetworkIdEnum.NEAR);

    if (nearNetwork) {
      const near = await Near.connect(nearNetwork);
      return near?.disconnect();
    }
  };

  const logout = async (url?: string) => {
    window.localStorage.removeItem('email');

    const promises: Promise<SignOutResponse | void>[] = [
      signOut({
        callbackUrl: url || publicRuntimeConfig.appAuthURL,
        redirect: true,
      }),
    ];

    if (!anonymousUser) {
      promises.unshift(FirebaseMessaging.unregister(), clearNearCache(), provider?.disconnect());
    }

    await Promise.all(promises);
  };

  return {
    logout,
    clearNearCache,
    getRegisteredAccounts,
    fetchUserNonce,
    signInWithExternalAuth,
    signUpWithExternalAuth,
  };
};
