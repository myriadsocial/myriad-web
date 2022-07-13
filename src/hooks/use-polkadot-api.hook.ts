import * as Sentry from '@sentry/nextjs';

import {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {BN, BN_ONE, BN_TWO, BN_TEN} from '@polkadot/util';

import {SimpleSendTipProps} from '../interfaces/transaction';
import {estimateFeeReference} from './../lib/services/polkadot-js';

import {useEnqueueSnackbar} from 'components/common/Snackbar/useEnqueueSnackbar.hook';
import isEmpty from 'lodash/isEmpty';
import {formatBalance} from 'src/helpers/balance';
import {BalanceDetail} from 'src/interfaces/balance';
import {BlockchainPlatform, WalletDetail, WalletReferenceType} from 'src/interfaces/wallet';
import {storeTransaction} from 'src/lib/api/transaction';
import {estimateFee, signAndSendExtrinsic} from 'src/lib/services/polkadot-js';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';
import {fetchBalances} from 'src/reducers/balance/actions';
import {BalanceState} from 'src/reducers/balance/reducer';
import {UserState} from 'src/reducers/user/reducer';

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

  const getEstimatedFeeReference = async (
    from: string,
    walletDetail: WalletDetail,
    selectedCurrency: BalanceDetail,
    accountIdMyriad: string,
  ): Promise<BN | null> => {
    setIsFetchingFee(true);

    try {
      let {partialFee: estimatedFee} = await estimateFeeReference(
        from,
        walletDetail,
        selectedCurrency,
        accountIdMyriad,
      );

      if (!estimatedFee) {
        // equal 0.01
        estimatedFee = BN_ONE.mul(BN_TEN.pow(new BN(selectedCurrency.decimal))).div(
          BN_TEN.pow(BN_TWO),
        );
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
          currencyId: currency.id,
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

  return {
    loadingBalance,
    loading,
    balanceDetails,
    isSignerLoading,
    isFetchingFee,
    error,
    simplerSendTip,
    getEstimatedFee,
    getEstimatedFeeReference,
  };
};
