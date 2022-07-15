import * as Sentry from '@sentry/nextjs';

import {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {ApiPromise} from '@polkadot/api';
import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';
import {BN, BN_ONE, BN_TWO, BN_TEN} from '@polkadot/util';

import {SimpleSendTipProps} from '../interfaces/transaction';

import {useEnqueueSnackbar} from 'components/common/Snackbar/useEnqueueSnackbar.hook';
import isEmpty from 'lodash/isEmpty';
import {VariantType} from 'notistack';
import {formatBalance} from 'src/helpers/balance';
import {BalanceDetail} from 'src/interfaces/balance';
import {TipResult, TipsBalance, TipsBalanceData, TipsBalanceInfo} from 'src/interfaces/network';
import {SocialMedia} from 'src/interfaces/social';
import {BlockchainPlatform, WalletDetail, WalletReferenceType} from 'src/interfaces/wallet';
import {storeTransaction} from 'src/lib/api/transaction';
import * as WalletAPI from 'src/lib/api/wallet';
import {
  batchClaimReferenceFee,
  estimateFee,
  getClaimTip,
  sendTip,
  signAndSendExtrinsic,
} from 'src/lib/services/polkadot-js';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';
import {fetchBalances} from 'src/reducers/balance/actions';
import {BalanceState} from 'src/reducers/balance/reducer';
import {UserState} from 'src/reducers/user/reducer';

interface TipsBalanceResult {
  tipsBalance: TipsBalance[];
  peopleIds: string[];
}

export const usePolkadotApi = () => {
  const dispatch = useDispatch();

  const {anonymous, currencies, currentWallet} = useSelector<RootState, UserState>(
    state => state.userState,
  );
  const {balanceDetails, loading: loadingBalance} = useSelector<RootState, BalanceState>(
    state => state.balanceState,
  );

  const enqueueSnackbar = useEnqueueSnackbar();

  const [loading, setLoading] = useState(false);
  const [isFetchingFee, setIsFetchingFee] = useState(false);
  const [isSignerLoading, setSignerLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (
      !anonymous &&
      currencies.length > 0 &&
      balanceDetails.length === 0 &&
      currentWallet?.network?.blockchainPlatform === BlockchainPlatform.SUBSTRATE
    ) {
      dispatch(fetchBalances());
    }
  }, [anonymous, currencies, balanceDetails, currentWallet]);

  const getEstimatedFee = async (
    from: string,
    walletDetail: WalletDetail,
    currency: BalanceDetail,
  ): Promise<BN | null> => {
    setIsFetchingFee(true);

    try {
      let {partialFee: estimatedFee} = await estimateFee(from, walletDetail, currency);

      if (!estimatedFee) {
        // equal 0.01
        estimatedFee = BN_ONE.mul(BN_TEN.pow(new BN(currency.decimal))).div(BN_TEN.pow(BN_TWO));
      }

      return estimatedFee;
    } catch (error) {
      Sentry.captureException(error);
      return null;
    } finally {
      setIsFetchingFee(false);
    }
  };

  const simplerSendTip = async (
    {from, amount, currency, type, referenceId, walletDetail, to: toId}: SimpleSendTipProps,
    callback?: (hash: string) => void,
  ) => {
    setLoading(true);
    setError(null);

    try {
      const txHash = await signAndSendExtrinsic(
        {
          from,
          value: amount,
          referenceId: currency.referenceId,
          wsAddress: currency.network.rpcURL,
          native: currency.native,
          decimal: currency.decimal,
          walletDetail,
        },
        params => {
          if (params.signerOpened) {
            setSignerLoading(true);
          }
        },
      );

      if (isEmpty(txHash)) {
        throw {
          message: 'Cancelled',
        };
      }

      if (txHash) {
        const finalAmount = formatBalance(amount, currency.decimal);
        const to =
          walletDetail.referenceType === WalletReferenceType.WALLET_ADDRESS
            ? walletDetail.referenceId
            : toId;

        // Record the transaction
        await storeTransaction({
          // TODO: should add the extrinsicURL: explorerURL + txHash
          hash: txHash,
          amount: finalAmount,
          from,
          to,
          currencyId: currency.id,
          type,
          referenceId,
        });

        callback && callback(txHash);
      }
    } catch (error) {
      console.error(error);
      if (error.message === 'Cancelled') {
        enqueueSnackbar({
          variant: 'warning',
          message: i18n.t('Tipping.Toaster.Cancelled'),
        });
      } else {
        enqueueSnackbar({
          variant: 'warning',
          message: error.message,
        });
      }
    } finally {
      setLoading(false);
      setSignerLoading(false);
    }
  };

  const payTransactionFee = async (
    account: InjectedAccountWithMeta,
    rpcURL: string,
    tipsBalanceInfo: TipsBalanceInfo,
    amount: string,
    callback?: (hasSuccess?: boolean, hash?: string) => void,
  ) => {
    let message = 'Claiming Reference Success';
    let variant: VariantType = 'success';
    let success = true;
    let hash = '';

    try {
      hash = await sendTip(account, rpcURL, tipsBalanceInfo, amount, ({signerOpened}) => {
        if (signerOpened) {
          setSignerLoading(true);
        }
      });

      await WalletAPI.claimReference({txFee: amount});
    } catch (err) {
      success = false;
      variant = err.message === 'Cancelled' ? 'warning' : 'error';
      message = err.message;
    } finally {
      setSignerLoading(false);
      enqueueSnackbar({variant, message});
      callback && callback(success, hash);
    }
  };

  const getClaimReferenceEstimatedFee = (
    api: ApiPromise,
    referenceId: string,
    referenceIds: string[],
    currencyIds: string[],
    accountId: string,
    server: WalletAPI.Server,
  ) => {
    return batchClaimReferenceFee(
      api,
      {referenceType: 'people', referenceIds},
      {referenceType: 'user', referenceIds: [referenceId]},
      currencyIds,
      accountId,
      server,
    );
  };

  const getClaimTipMyriad = async (
    api: ApiPromise,
    serverId: string,
    referenceId: string,
    accountId: string,
    socials: SocialMedia[],
  ): Promise<TipsBalanceResult> => {
    if (!api) return;

    const peopleIds: string[] = [];
    const data: TipsBalanceData = {
      native: {
        tipsBalanceInfo: {
          serverId,
          referenceType: 'user',
          referenceId,
          ftIdentifier: 'native',
        },
        amount: new BN(0),
        accountId,
      },
    };

    const socialTipsPromise = Promise.all(
      socials.map(social => {
        peopleIds.push(social.peopleId);
        return getClaimTip(api, serverId, 'people', social.peopleId);
      }),
    );

    const [socialTips, userTips] = await Promise.all([
      socialTipsPromise,
      getClaimTip(api, serverId, 'user', referenceId),
    ]);

    for (const socialTip of socialTips) {
      if (socialTip.length === 0) continue;
      for (const [_, rawTipBalance] of socialTip) {
        const tipsBalance = rawTipBalance.toHuman() as unknown as TipResult;
        const ftIdentifier = tipsBalance.tipsBalanceInfo.ftIdentifier;
        const amount = new BN(tipsBalance.amount.replace(/,/gi, ''));

        if (amount.isZero()) continue;
        if (data[ftIdentifier] === undefined) {
          data[ftIdentifier] = {
            tipsBalanceInfo: {
              serverId,
              referenceType: 'user',
              referenceId: referenceId,
              ftIdentifier,
            },
            amount: new BN(0),
            accountId: null,
          };
        }

        const dataAmount = data[ftIdentifier].amount;
        data[ftIdentifier].amount = dataAmount.add(amount);
        data[ftIdentifier].accountId = null;
      }
    }

    for (const [_, rawTipBalance] of userTips) {
      const tipsBalance = rawTipBalance.toHuman() as unknown as TipResult;
      const ftIdentifier = tipsBalance.tipsBalanceInfo.ftIdentifier;
      const amount = new BN(tipsBalance.amount.replace(/,/gi, ''));
      const accountId = tipsBalance.accountId;

      if (data[ftIdentifier] === undefined) {
        data[ftIdentifier] = {
          tipsBalanceInfo: tipsBalance.tipsBalanceInfo,
          amount: new BN(0),
          accountId: tipsBalance.accountId,
        };
      }

      const dataAmount = data[ftIdentifier].amount;
      data[ftIdentifier].amount = dataAmount.add(amount);
      if (!accountId) data[ftIdentifier].accountId = null;
    }

    return {
      tipsBalance: Object.values(data),
      peopleIds,
    };
  };

  return {
    loadingBalance,
    loading,
    balanceDetails,
    isSignerLoading,
    isFetchingFee,
    error,
    simplerSendTip,
    getEstimatedFee,
    payTransactionFee,
    getClaimReferenceEstimatedFee,
    getClaimTipMyriad,
  };
};
