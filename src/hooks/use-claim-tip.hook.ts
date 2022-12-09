import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

import {useSession} from 'next-auth/react';
import getConfig from 'next/config';
import {useRouter} from 'next/router';

import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';

import {useNearApi} from './use-near-api.hook';
import {usePolkadotApi} from './use-polkadot-api.hook';

import useBlockchain from 'components/common/Blockchain/use-blockchain.hook';
import {useEnqueueSnackbar} from 'components/common/Snackbar/useEnqueueSnackbar.hook';
import {VariantType} from 'notistack';
import {FeeInfo, TipsBalanceInfo} from 'src/interfaces/blockchain';
import {Network, NetworkIdEnum} from 'src/interfaces/network';
import * as TransactionAPI from 'src/lib/api/transaction';
import * as WalletAPI from 'src/lib/api/wallet';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

interface ClaimProps {
  claimSuccess: boolean;
  errorMessage: string;
}

const {publicRuntimeConfig} = getConfig();

export const useClaimTip = () => {
  const router = useRouter();
  const enqueueSnackbar = useEnqueueSnackbar();

  const {user, networks, socials} = useSelector<RootState, UserState>(state => state.userState);
  const {getClaimTipNear} = useNearApi();
  const {getClaimTipMyriad} = usePolkadotApi();
  const {server, provider} = useBlockchain();
  const {data: session} = useSession();

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

  const currentNetworkId = session?.user?.networkType ?? (null as NetworkIdEnum);
  const accountId = session?.user?.address ?? (null as string);

  const transactionHashes = router.query.transactionHashes as string | null;
  const errorCode = router.query.errorCode as string | null;
  const errorMessage = router.query.errorMessage as string | null;
  const txFee = router.query.txFee as string | null;
  const txInfo = router.query.txInfo as string | null;

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
    if (currentNetworkId || !user.fullAccess) {
      if (txFee && !errorMessage && !errorCode) {
        let message = 'Claiming Reference Success';
        let variant: VariantType = 'success';
        let isClaimingSucceed = true;

        claimReference(txFee)
          .catch(error => {
            isClaimingSucceed = false;
            message = error.message;
            variant = 'error';
          })
          .finally(() => {
            getTip(isClaimingSucceed);
            enqueueSnackbar({message, variant});

            const url = new URL(router.asPath, publicRuntimeConfig.appAuthURL);

            url.search = '';

            router.replace(url, undefined, {shallow: true});
          });
      } else {
        getTip();
      }
    }
  }, [currentNetworkId, user.fullAccess]);

  const getTip = async (isClaimingSucceed = false) => {
    setLoading(true);

    if (!user || !server) return setLoading(false);

    const sortedNetworkPromise = [];

    try {
      const networkCallback = async (network: Network) => {
        if (!server?.accountId?.[network.id]) return network;

        switch (network.id) {
          case NetworkIdEnum.MYRIAD: {
            const result = await getClaimTipMyriad(user.id, server, socials, network);
            const {currencies, feeInfo: fee, isUserHasTip, hasToClaimed} = result;

            if (fee) setFeeInfo(fee);

            network.currencies = currencies;
            network.isUserHasTip = isUserHasTip;
            network.hasToClaimed = hasToClaimed;
            return network;
          }

          case NetworkIdEnum.NEAR: {
            const result = await getClaimTipNear(
              user.id,
              server,
              socials,
              network,
              isClaimingSucceed,
            );
            const {currencies, feeInfo: fee, isUserHasTip, hasToClaimed} = result;

            if (fee) setFeeInfo(fee);

            network.currencies = currencies;
            network.isUserHasTip = isUserHasTip;
            network.hasToClaimed = hasToClaimed;
            return network;
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

  const claim = async (ftIdentifier: string, callback?: (ClaimProps: ClaimProps) => void) => {
    if (!user) return;
    if (!session?.user?.address) return;
    if (!session?.user?.networkType) return;

    const networkId = session?.user?.networkType as NetworkIdEnum;

    let errorMessage = null;
    let claimSuccess = true;

    setClaiming(true);

    try {
      if (!server?.accountId?.[networkId]) {
        throw new Error('ServerNotExists');
      }

      const serverId = server?.accountId?.[networkId];
      const selectedNetwork = networks.find(network => network.id === networkId);
      const currency = selectedNetwork?.currencies?.find(({native, referenceId}) => {
        if (ftIdentifier === 'native' && native) return true;
        return referenceId === ftIdentifier;
      });

      const trxInfo = {
        walletId: accountId,
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

  const claimAll = async (callback?: (claimProps: ClaimProps) => void) => {
    if (!user) return;
    if (!session?.user?.address) return;
    if (!session?.user?.networkType) return;

    const networkId = session?.user?.networkType as NetworkIdEnum;

    let errorMessage = null;
    let claimSuccess = true;

    setClaimingAll(true);

    const walletId = accountId;
    const serverId = server?.accountId?.[networkId];
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
        walletId: accountId,
        currencyIds,
      };

      await provider.claimTip(serverId, userId, ftIdentifiers, JSON.stringify(trxInfo), true);

      if (currencyIds.length > 0) TransactionAPI.updateTransaction({walletId, currencyIds});

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
      if (parseInt(txFee) === 0) throw new Error('Insufficient Gas Fee');

      await WalletAPI.claimReference({txFee, tippingContractId});

      if (session?.user.networkType !== NetworkIdEnum.NEAR) {
        const updatedNetwork = tipsEachNetwork.map(e => {
          if (e.id !== session?.user.networkType) return e;
          if (!e?.currencies) return e;
          if (session?.user?.address) return e;
          if (session?.user?.networkType === NetworkIdEnum.NEAR) return e;

          const currencies = e.currencies.map(currency => {
            currency.accountId = session?.user?.address;
            return currency;
          });

          e.currencies = currencies;
          e.hasToClaimed = false;
          e.isUserHasTip = true;
          return e;
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
    account?: InjectedAccountWithMeta,
    callback?: (hash?: string) => void,
  ) => {
    let hash = '';

    setVerifyingReference(true);

    try {
      hash = await provider.payTransactionFee(
        tipsBalanceInfo,
        amount,
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
