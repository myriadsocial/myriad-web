import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

import getConfig from 'next/config';
import {useRouter} from 'next/router';

import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';

import {useNearApi} from './use-near-api.hook';
import {usePolkadotApi} from './use-polkadot-api.hook';

import useBlockchain from 'components/common/Blockchain/use-blockchain.hook';
import {useEnqueueSnackbar} from 'components/common/Snackbar/useEnqueueSnackbar.hook';
import {VariantType} from 'notistack';
import {getServerId} from 'src/helpers/wallet';
import {FeeInfo, TipsBalanceInfo} from 'src/interfaces/blockchain-interface';
import {Network, NetworkIdEnum} from 'src/interfaces/network';
import * as TransactionAPI from 'src/lib/api/transaction';
import * as WalletAPI from 'src/lib/api/wallet';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

const {publicRuntimeConfig} = getConfig();

export const useClaimTip = () => {
  const router = useRouter();
  const enqueueSnackbar = useEnqueueSnackbar();

  const {user, networks, socials} = useSelector<RootState, UserState>(state => state.userState);
  const {getClaimTipNear} = useNearApi();
  const {getClaimTipMyriad} = usePolkadotApi();
  const {server, provider} = useBlockchain();

  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [claimingAll, setClaimingAll] = useState(false);
  const [verifyingReference, setVerifyingReference] = useState(false);
  const [tipsEachNetwork, setTipsEachNetwork] = useState<Network[]>(networks);
  const [isSignerLoading, setSignerLoading] = useState<boolean>(false);
  const [feeInfo, setFeeInfo] = useState<FeeInfo>({
    formattedTrxFee: '0.00',
    trxFee: '0',
  });

  const currentWallet = user.wallets[0];

  const transactionHashes = router.query.transactionHashes as string | null;
  const errorCode = router.query.errorCode as string | null;
  const errorMessage = router.query.errorMessage as string | null;
  const txFee = router.query.txFee as string | null;
  const txInfo = router.query.txInfo as string | null;
  const nativeBalance = router.query.balance as string | null;

  useEffect(() => {
    const url = new URL(router.asPath, publicRuntimeConfig.appAuthURL);

    if (!txFee && !txInfo && transactionHashes) {
      enqueueSnackbar({
        message: i18n.t('Wallet.Tip.Alert.Success'),
        variant: 'success',
      });

      url.search = '';

      router.replace(url, undefined, {shallow: true});
    }

    if (errorCode && errorMessage) {
      enqueueSnackbar({
        // TODO: Register Translation
        message: decodeURI(errorMessage),
        variant: 'warning',
      });

      url.search = '';

      router.replace(url, undefined, {shallow: true});
    }

    if (txInfo && !errorCode && !errorMessage) {
      TransactionAPI.updateTransaction(JSON.parse(txInfo)).catch(() => console.log);

      url.search = '';

      router.replace(url, undefined, {shallow: true});
    }
  }, [errorCode, transactionHashes, errorMessage, errorCode]);

  useEffect(() => {
    if (currentWallet) {
      if (txFee && !errorMessage && !errorCode) {
        let message = 'Claiming Reference Success';
        let variant: VariantType = 'success';
        let verifyNearTips = true;

        claimReference(txFee)
          .catch(error => {
            verifyNearTips = false;
            message = error.message;
            variant = 'error';
          })
          .finally(() => {
            getTip(verifyNearTips, nativeBalance);
            enqueueSnackbar({message, variant});

            const url = new URL(router.asPath, publicRuntimeConfig.appAuthURL);

            url.search = '';

            router.replace(url, undefined, {shallow: true});
          });
      } else {
        getTip();
      }
    }
  }, [currentWallet, txFee, errorMessage, errorCode]);

  const getTip = async (verifyNearTips = false, nativeBalance = '0.00') => {
    setLoading(true);

    if (!user || !server) return setLoading(false);

    const currentNetworkId = currentWallet.networkId;
    const sortedNetworkPromise = [];

    try {
      const networkCallback = async (network: Network) => {
        const serverId = getServerId(server, network.id);
        const tipBalanceInfo = {
          serverId: serverId,
          referenceType: 'user',
          referenceId: user.id,
          ftIdentifier: 'native',
        };

        if (!serverId) return network;

        switch (network.id) {
          case NetworkIdEnum.MYRIAD: {
            const result = await getClaimTipMyriad(
              server,
              user.id,
              currentWallet,
              socials,
              network,
            );

            const {tipsResults, feeInfo: fee} = result;

            if (fee) setFeeInfo(fee);

            return {
              ...network,
              tips: tipsResults,
            };
          }

          case NetworkIdEnum.NEAR: {
            const {serverId, referenceId} = tipBalanceInfo;
            const referenceIds = socials.map(social => social.peopleId);
            const result = await getClaimTipNear(
              serverId,
              referenceId,
              referenceIds,
              currentWallet,
              network,
              verifyNearTips,
              nativeBalance,
            );

            const {tipsResults, feeInfo: fee} = result;

            if (fee) setFeeInfo(fee);

            return {
              ...network,
              tips: tipsResults,
            };
          }

          default:
            return network;
        }
      };

      for (const network of networks) {
        if (network.id === currentNetworkId) {
          sortedNetworkPromise.unshift(networkCallback(network));
        } else {
          sortedNetworkPromise.push(networkCallback(network));
        }
      }

      const networksWithTip = await Promise.all<Network[]>(sortedNetworkPromise);

      setTipsEachNetwork(networksWithTip);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const claim = async (
    networkId: string,
    ftIdentifier: string,
    callback?: ({claimSuccess: boolean, errorMessage: string}) => void,
  ) => {
    if (!user) return;
    if (!user?.wallets[0]) return;

    const selectedNetwork = networks.find(network => network.id == networkId);

    if (!selectedNetwork) return;

    let errorMessage = null;
    let claimSuccess = true;

    setClaiming(true);

    try {
      const serverId = getServerId(server, selectedNetwork.id);

      if (!serverId) throw new Error('ServerNotExists');

      const currency = selectedNetwork.currencies?.find(({native, referenceId}) => {
        if (ftIdentifier === 'native' && native) return true;
        return referenceId === ftIdentifier;
      });

      const trxInfo = {
        userId: user.id,
        walletId: currentWallet.id,
        currencyIds: [currency.id],
      };

      await provider.claimTip(serverId, user.id, [ftIdentifier], JSON.stringify(trxInfo), false);

      if (currency) TransactionAPI.updateTransaction(trxInfo);

      getTip();
    } catch (error) {
      errorMessage = error.message;
      claimSuccess = false;
    } finally {
      setClaiming(false);
      callback && callback({claimSuccess, errorMessage});
    }
  };

  const claimAll = async (
    networkId: string,
    callback?: ({claimSuccess: boolean, errorMessage: string}) => void,
  ) => {
    if (!user) return;

    let errorMessage = null;
    let claimSuccess = true;

    setClaimingAll(true);

    const walletId = currentWallet.id;
    const serverId = getServerId(server, networkId as NetworkIdEnum);
    const selectedNetwork = networks.find(network => network.id == networkId);
    const userId = user.id;
    const currencyIds = [];
    const ftIdentifiers = ['native'];

    selectedNetwork?.currencies?.forEach(currency => {
      currencyIds.push(currency.id);
      if (Boolean(currency.referenceId)) {
        ftIdentifiers.push(currency.referenceId);
      }
    });

    try {
      if (!serverId) throw new Error('ServerNotExists');

      const trxInfo = {
        userId: user.id,
        walletId: currentWallet.id,
        currencyIds,
      };

      await provider.claimTip(serverId, userId, ftIdentifiers, JSON.stringify(trxInfo), true);

      if (currencyIds.length > 0) TransactionAPI.updateTransaction({userId, walletId, currencyIds});

      getTip();
    } catch (error) {
      errorMessage = error.message;
      claimSuccess = false;
    } finally {
      setClaimingAll(false);
      callback && callback({claimSuccess, errorMessage});
    }
  };

  const claimReference = async (txFee: string) => {
    const tippingContractId = publicRuntimeConfig.nearTippingContractId;

    try {
      await WalletAPI.claimReference({txFee, tippingContractId});

      if (currentWallet.networkId !== NetworkIdEnum.NEAR) {
        const updatedNetwork = tipsEachNetwork.map(e => {
          if (e.id !== currentWallet?.networkId) return e;
          const tips = e.tips.map(tip => {
            return {
              ...tip,
              accountId: currentWallet.id,
            };
          });

          return {
            ...e,
            tips,
          };
        });

        setTipsEachNetwork(updatedNetwork);
      }
    } catch (err) {
      throw err;
    }
  };

  const payTransactionFee = async (
    tipsBalanceInfo: TipsBalanceInfo,
    amount: string,
    nativeBalance?: string,
    account?: InjectedAccountWithMeta,
    callback?: (hash?: string) => void,
  ) => {
    let hash = '';

    setVerifyingReference(true);

    try {
      hash = await provider.payTransactionFee(
        tipsBalanceInfo,
        amount,
        nativeBalance,
        account,
        ({signerOpened}) => {
          if (signerOpened) setSignerLoading(true);
        },
      );

      await claimReference(amount);
    } catch (err) {
      throw err;
    } finally {
      setSignerLoading(false);
      setVerifyingReference(false);

      callback && callback(hash);
    }
  };

  return {
    loading,
    isSignerLoading,
    claiming,
    claimingAll,
    verifyingReference,
    getTip,
    claim,
    claimAll,
    feeInfo,
    server,
    tipsEachNetwork,
    claimReference,
    payTransactionFee,
  };
};
