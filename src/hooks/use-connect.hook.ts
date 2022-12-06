import * as Sentry from '@sentry/nextjs';

import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {signIn, useSession} from 'next-auth/react';
import getConfig from 'next/config';
import {useRouter} from 'next/router';

import {isHex} from '@polkadot/util';

import {useNearApi} from './use-near-api.hook';

import {CURRENT_NETWORK_KEY, Network, NetworkIdEnum} from 'src/interfaces/network';
import {WalletWithSigner} from 'src/interfaces/user';
import {BlockchainPlatform} from 'src/interfaces/wallet';
import {AccountRegisteredError} from 'src/lib/api/errors/account-registered.error';
import * as WalletAPI from 'src/lib/api/wallet';
import {toHexPublicKey} from 'src/lib/crypto';
import {PolkadotJs} from 'src/lib/services/polkadot-js';
import {RootState} from 'src/reducers';
import {fetchUser, fetchUserWallets} from 'src/reducers/user/actions';
import {UserState} from 'src/reducers/user/reducer';

export interface NearPayload {
  publicAddress: string;
  nearAddress: string;
  pubKey: string;
  signature: string;
  nonce: number;
}

export const useConnect = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const {publicRuntimeConfig} = getConfig();
  const {connectToNear} = useNearApi();
  const {data: session} = useSession();

  const [loading, setLoading] = useState<boolean>(false);

  const connectWallet = async (
    wallet: WalletWithSigner,
    network: Network,
    callback?: (error: boolean) => void,
  ): Promise<void> => {
    if (!user) return;

    try {
      const redirectUrl = new URL(router.asPath, publicRuntimeConfig.appAuthURL);
      const blockchainPlatform = wallet.blockchainPlatform;
      const credential = {
        walletType: wallet.type,
        blockchainPlatform,
        instanceURL: session.user.instanceURL,
        nonce: 0,
        publicAddress: '',
        signature: '',
        networkType: '',
      };

      switch (blockchainPlatform) {
        case BlockchainPlatform.SUBSTRATE: {
          const {nonce} = await WalletAPI.getUserNonceByUserId(user?.id);
          if (!nonce) return;
          if (!wallet.signer) return;
          const signature = await PolkadotJs.signWithWallet(
            wallet.signer,
            nonce,
            ({signerOpened}) => {
              if (signerOpened) setLoading(true);
            },
          );
          if (!signature) return;
          Object.assign(credential, {
            nonce: nonce,
            address: toHexPublicKey(wallet.signer),
            publicAddress: toHexPublicKey(wallet.signer),
            signature: signature,
            networkType: NetworkIdEnum.MYRIAD,
          });
          break;
        }

        case BlockchainPlatform.NEAR: {
          const callbackUrl = new URL(router.asPath, publicRuntimeConfig.appAuthURL);

          // clear previous query param
          redirectUrl.hash = '';
          redirectUrl.search = '';
          callbackUrl.hash = '';
          callbackUrl.search = '';

          callbackUrl.searchParams.set('type', 'manage');
          callbackUrl.searchParams.set('action', 'connect');
          callbackUrl.searchParams.set('walletType', wallet.type);

          const url = callbackUrl.toString();
          const data = await connectToNear(
            {successCallbackURL: url, failedCallbackURL: url},
            {userId: user.id, network},
            wallet.type,
          );

          if (!data) return;
          const address = data.publicAddress.split('/')[1];
          Object.assign(credential, {
            nonce: data.nonce,
            address: isHex(`0x${address}`) ? `0x${address}` : address,
            publicAddress: data.publicAddress,
            signature: data.signature,
            networkType: NetworkIdEnum.NEAR,
          });
          break;
        }

        default:
          throw new Error('FailedToConnect');
      }

      if (user.fullAccess) {
        await WalletAPI.connectWallet({
          publicAddress: credential.publicAddress,
          nonce: credential.nonce,
          signature: credential.signature,
          networkType: credential.networkType,
          walletType: credential.walletType,
        });
      } else {
        const response = await signIn('connectWallet', {...credential, redirect: false});

        if (response.error) {
          throw new Error('FailedToConnect');
        }

        dispatch(fetchUser());

        router.replace(redirectUrl, undefined, {shallow: true});

        window.localStorage.setItem(CURRENT_NETWORK_KEY, JSON.stringify(network));
      }

      dispatch(fetchUserWallets());

      callback && callback(false);
    } catch (err) {
      callback && callback(true);

      if (err instanceof AccountRegisteredError) {
        throw err;
      } else {
        Sentry.captureException(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = async (
    wallet: WalletWithSigner,
    network?: Network,
    callback?: (error: boolean) => void,
  ): Promise<void> => {
    if (!user) return;

    try {
      const redirectUrl = new URL(router.asPath, publicRuntimeConfig.appAuthURL);
      const blockchainPlatform = wallet.blockchainPlatform;
      const credential: Partial<WalletAPI.ConnectWallet> = {
        walletType: wallet.type,
      };

      let address = null;

      switch (blockchainPlatform) {
        case BlockchainPlatform.SUBSTRATE: {
          const {nonce} = await WalletAPI.getUserNonceByUserId(user?.id);
          if (!nonce) return;
          if (!wallet.signer) return;
          const signature = await PolkadotJs.signWithWallet(
            wallet.signer,
            nonce,
            ({signerOpened}) => {
              if (signerOpened) setLoading(true);
            },
          );
          if (!signature) return;
          address = toHexPublicKey(wallet.signer);

          credential.publicAddress = address;
          credential.signature = signature;
          credential.networkType = NetworkIdEnum.MYRIAD;
          credential.nonce = nonce;
          break;
        }

        case BlockchainPlatform.NEAR: {
          if (!network) return;
          const callbackUrl = new URL(router.asPath, publicRuntimeConfig.appAuthURL);

          // clear previous query param
          redirectUrl.hash = '';
          redirectUrl.search = '';
          callbackUrl.hash = '';
          callbackUrl.search = '';

          callbackUrl.searchParams.set('type', 'manage');
          callbackUrl.searchParams.set('action', 'disconnect');
          callbackUrl.searchParams.set('walletType', wallet.type);

          const url = callbackUrl.toString();
          const data = await connectToNear(
            {successCallbackURL: url, failedCallbackURL: url},
            {userId: user.id, network},
            wallet.type,
          );

          if (!data) return;
          const [publicAddress, nearAddress] = data.publicAddress.split('/');
          address = nearAddress;

          credential.nonce = data.nonce;
          credential.signature = data.signature;
          credential.networkType = NetworkIdEnum.NEAR;
          credential.publicAddress = publicAddress;

          break;
        }

        default:
          throw new Error('FailedToConnect');
      }

      if (!address) throw new Error('AddressNotFound');

      await WalletAPI.disconnectWallet(credential as WalletAPI.ConnectWallet, address);

      dispatch(fetchUserWallets());

      router.replace(redirectUrl, undefined, {shallow: true});

      callback && callback(false);
    } catch (err) {
      callback && callback(true);

      if (err instanceof AccountRegisteredError) {
        throw err;
      } else {
        Sentry.captureException(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const switchNetwork = async (
    wallet: WalletWithSigner,
    network: Network,
    callback?: () => void,
  ) => {
    if (!user) return;

    setLoading(true);

    try {
      const redirectUrl = new URL(router.asPath, publicRuntimeConfig.appAuthURL);
      const blockchainPlatform = wallet.blockchainPlatform;
      const credential = {
        networkType: network.id,
        walletType: wallet.type,
        instanceURL: session.user.instanceURL,
        blockchainPlatform,
      };

      switch (blockchainPlatform) {
        case BlockchainPlatform.SUBSTRATE: {
          const {nonce} = await WalletAPI.getUserNonceByUserId(user?.id);
          const signer = wallet.signer;
          if (!signer) return;
          const signature = await PolkadotJs.signWithWallet(signer, nonce, ({signerOpened}) => {
            if (signerOpened) setLoading(true);
          });

          if (!signature) return;
          Object.assign(credential, {
            address: toHexPublicKey(signer),
            publicAddress: toHexPublicKey(signer),
            nonce: nonce,
            signature: signature,
          });
          break;
        }

        case BlockchainPlatform.NEAR: {
          const callbackUrl = new URL(router.asPath, publicRuntimeConfig.appAuthURL);

          // clear previous query param
          redirectUrl.hash = '';
          redirectUrl.search = '';
          callbackUrl.hash = '';
          callbackUrl.search = '';

          callbackUrl.searchParams.set('action', 'switch');
          callbackUrl.searchParams.set('loading', 'true');
          callbackUrl.searchParams.set('walletType', wallet.type);

          const signatureData = await connectToNear(
            {successCallbackURL: callbackUrl.toString(), failedCallbackURL: redirectUrl.toString()},
            {userId: user.id, network},
            wallet.type,
            'switch',
          );

          if (!signatureData) return;
          const address = signatureData.publicAddress.split('/')[1];
          Object.assign(credential, {
            address: isHex(`0x${address}`) ? `0x${address}` : address,
            nonce: signatureData.nonce,
            publicAddress: signatureData.publicAddress,
            signature: signatureData.signature,
          });
          break;
        }

        default:
          throw new Error('Network not exists');
      }

      const response = await signIn('switchNetwork', {...credential, redirect: false});

      if (response.error) {
        throw new Error('FailedToSwitch');
      }

      await dispatch(fetchUser());
      await dispatch(fetchUserWallets());

      router.replace(redirectUrl, undefined, {shallow: true});

      window.localStorage.setItem(CURRENT_NETWORK_KEY, JSON.stringify(network));

      callback && callback();
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    connectWallet,
    disconnectWallet,
    switchNetwork,
  };
};
