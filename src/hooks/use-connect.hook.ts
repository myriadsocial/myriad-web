import * as Sentry from '@sentry/nextjs';

import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';
import {isHex} from '@polkadot/util';

import {NetworkIdEnum} from 'src/interfaces/network';
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

  const {user} = useSelector<RootState, UserState>(state => state.userState);

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
    blockchainPlatform: BlockchainPlatform,
    networkId: NetworkIdEnum,
    account: InjectedAccountWithMeta | NearPayload,
    callback?: () => void,
  ) => {
    if (!user) return;

    setLoading(true);

    try {
      let payload: WalletAPI.ConnectNetwork;
      let currentAddress: string;

      switch (blockchainPlatform) {
        case BlockchainPlatform.SUBSTRATE: {
          const {nonce} = await WalletAPI.getUserNonceByUserId(user?.id);

          const polkadotAccount = account as InjectedAccountWithMeta;
          const signature = await PolkadotJs.signWithWallet(
            polkadotAccount,
            nonce,
            ({signerOpened}) => {
              if (signerOpened) setLoading(true);
            },
          );

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
            nonce: nearAccount.nonce,
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

      await dispatch(fetchUser());
      await dispatch(fetchUserWallets());

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

  return {
    loading,
    connectDisconnectNetwork,
    switchNetwork,
  };
};
