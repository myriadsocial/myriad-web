import * as Sentry from '@sentry/nextjs';

import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {signIn, useSession} from 'next-auth/react';
import getConfig from 'next/config';
import {useRouter} from 'next/router';

import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';
import {isHex} from '@polkadot/util';

import {useNearApi} from './use-near-api.hook';

import {Network, NetworkIdEnum} from 'src/interfaces/network';
import {WalletWithSigner} from 'src/interfaces/user';
import {BlockchainPlatform, WalletTypeEnum} from 'src/interfaces/wallet';
import {AccountRegisteredError} from 'src/lib/api/errors/account-registered.error';
import * as WalletAPI from 'src/lib/api/wallet';
import {toHexPublicKey} from 'src/lib/crypto';
import {PolkadotJs} from 'src/lib/services/polkadot-js';
import {RootState} from 'src/reducers';
import {fetchUser, fetchUserWallets, setFullAccess} from 'src/reducers/user/actions';
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

  const connectDisconnectNetwork = async (
    blockchainPlatform: BlockchainPlatform,
    account?: InjectedAccountWithMeta | NearPayload,
    walletId?: string,
    callback?: (disconnect: boolean, error: boolean) => void,
  ): Promise<boolean> => {
    if (!user) return false;
    if (!account) return false;

    try {
      let payload = null;

      switch (blockchainPlatform) {
        case BlockchainPlatform.SUBSTRATE:
          const {nonce} = await WalletAPI.getUserNonceByUserId(user?.id);

          if (!nonce) return false;

          const polkadotAccount = account as InjectedAccountWithMeta;
          const polkadotSignature = await PolkadotJs.signWithWallet(
            polkadotAccount,
            nonce,
            ({signerOpened}) => {
              if (signerOpened) setLoading(true);
            },
          );

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
          const {pubKey, nearAddress, nonce: nearNonce} = nearAccount;

          payload = {
            publicAddress: pubKey,
            nonce: nearNonce,
            signature: nearAccount.signature,
            networkType: NetworkIdEnum.NEAR,
            walletType: WalletTypeEnum.NEAR,
            data: {
              id: isHex(`0x${nearAddress}`) ? `0x${nearAddress}` : nearAddress,
            },
          };

          break;
      }

      if (!payload) return false;

      if (walletId) {
        await WalletAPI.disconnectNetwork(payload, walletId);

        callback && callback(true, false);
      } else {
        await WalletAPI.connectNetwork(payload, user.id);
      }

      if (!user.fullAccess) {
        await dispatch(fetchUser());
      }

      dispatch(setFullAccess());
      dispatch(fetchUserWallets());

      return true;
    } catch (err) {
      callback && callback(false, true);

      if (err instanceof AccountRegisteredError) {
        throw err;
      } else {
        Sentry.captureException(err);
      }
    } finally {
      setLoading(false);
    }

    return false;
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
            {network},
            wallet.type,
            'switch',
          );

          if (!signatureData) return;
          Object.assign(credential, {
            address: signatureData.publicAddress.split('/')[1],
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

      window.localStorage.setItem('currentNetwork', JSON.stringify(network));

      callback && callback();
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    connectDisconnectNetwork,
    switchNetwork,
  };
};
