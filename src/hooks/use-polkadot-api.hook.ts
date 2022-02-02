import * as Sentry from '@sentry/nextjs';

import {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {SimpleSendTipProps} from '../interfaces/transaction';
import {setIsTipSent, setFee} from '../reducers/wallet/actions';
import {WalletState} from '../reducers/wallet/reducer';

import _ from 'lodash';
import {useAlertHook} from 'src/hooks/use-alert.hook';
import {useTipSummaryHook} from 'src/hooks/use-tip-summary.hook';
import {useToasterSnackHook} from 'src/hooks/use-toaster-snack.hook';
import {BalanceDetail} from 'src/interfaces/balance';
import {SendTipProps} from 'src/interfaces/send-tips/send-tips';
import {ContentType} from 'src/interfaces/wallet';
import {storeTransaction} from 'src/lib/api/transaction';
import {estimateFee, signAndSendExtrinsic} from 'src/lib/services/polkadot-js';
import {RootState} from 'src/reducers';
import {fetchBalances} from 'src/reducers/balance/actions';
import {BalanceState} from 'src/reducers/balance/reducer';
import {UserState} from 'src/reducers/user/reducer';

export const usePolkadotApi = () => {
  const dispatch = useDispatch();

  const {anonymous, currencies} = useSelector<RootState, UserState>(state => state.userState);
  const {balanceDetails, loading: loadingBalance} = useSelector<RootState, BalanceState>(
    state => state.balanceState,
  );
  const {isTipSent} = useSelector<RootState, WalletState>(state => state.walletState);

  const {showAlert, showTipAlert} = useAlertHook();
  const {openTipSummaryForComment} = useTipSummaryHook();
  const {openToasterSnack} = useToasterSnackHook();

  const [loading, setLoading] = useState(false);
  const [isFetchingFee, setIsFetchingFee] = useState(false);
  const [isSignerLoading, setSignerLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!anonymous && currencies.length > 0 && balanceDetails.length === 0) {
      dispatch(fetchBalances());
    }
  }, [anonymous, currencies, balanceDetails]);

  // TODO: remove only if simplerSendTip works!
  const sendTip = async (
    {
      from,
      to,
      value,
      decimals,
      currencyId,
      referenceId,
      contentType,
      wsAddress,
      native,
    }: SendTipProps,
    callback?: () => void,
  ) => {
    setLoading(true);
    setError(null);

    try {
      setSignerLoading(true);

      const txHash = await signAndSendExtrinsic(
        {
          from,
          to,
          value,
          currencyId,
          wsAddress,
          native,
        },
        params => {
          if (params.signerOpened) {
            setSignerLoading(false);
          }
        },
      );

      if (_.isEmpty(txHash)) {
        throw {
          message: 'Cancelled',
        };
      }

      if (txHash) {
        const correctedValue = value / 10 ** decimals;

        if (contentType === ContentType.POST) {
          // Record the transaction
          await storeTransaction({
            hash: txHash,
            amount: correctedValue,
            from,
            to,
            currencyId: currencyId,
          });
        } else if (contentType === ContentType.COMMENT) {
          await storeTransaction({
            hash: txHash,
            amount: correctedValue,
            type: ContentType.COMMENT,
            referenceId,
            from,
            to,
            currencyId: currencyId,
          });
          openTipSummaryForComment();
        }
        // TODO: change to toaster
        showTipAlert({
          severity: 'success',
          title: 'Tip sent!',
          message: `${txHash}`,
        });

        callback && callback();
      }
    } catch (error) {
      if (error.message === 'Cancelled') {
        setError(error.message);
        // TODO: change to toaster
        showAlert({
          severity: 'warning',
          title: 'Aborted!',
          message: 'Transaction signing cancelled',
        });
      }
    } finally {
      setLoading(false);
      setSignerLoading(false);
    }
  };

  const getEstimatedFee = async (from: string, to: string, selectedCurrency: BalanceDetail) => {
    try {
      setIsFetchingFee(true);
      const {partialFee: estimatedFee, api} = await estimateFee(from, to, selectedCurrency);

      if (api) await api.disconnect();

      if (estimatedFee) dispatch(setFee(estimatedFee));
    } catch (error) {
      console.log({error});
      Sentry.captureException(error);
      return error;
    } finally {
      setIsFetchingFee(false);
    }
  };

  const simplerSendTip = async (
    {from, to, amount, currency, type, referenceId}: SimpleSendTipProps,
    callback?: () => void,
  ) => {
    setLoading(true);
    setError(null);

    if (isTipSent) {
      dispatch(setIsTipSent(false));
    }

    try {
      setSignerLoading(true);

      const correctedAmount = amount * 10 ** currency.decimal;

      const txHash = await signAndSendExtrinsic(
        {
          from,
          to,
          value: correctedAmount,
          currencyId: currency.id,
          wsAddress: currency.rpcURL,
          native: currency.native,
        },
        params => {
          if (params.signerOpened) {
            setSignerLoading(false);
          }
        },
      );

      if (_.isEmpty(txHash)) {
        throw {
          message: 'Cancelled',
        };
      }

      if (txHash) {
        // Record the transaction
        await storeTransaction({
          hash: txHash,
          amount,
          from,
          to,
          currencyId: currency.id,
          // Optionals for Post or Comment
          type: type === 'post' ? 'post' : 'comment',
          referenceId,
        });

        dispatch(setIsTipSent(true));

        callback && callback();
      }
    } catch (error) {
      if (error.message === 'Cancelled') {
        openToasterSnack({
          variant: 'warning',
          message: 'Transaction signing cancelled',
        });
      } else {
        openToasterSnack({
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
    sendTip,
    simplerSendTip,
    getEstimatedFee,
  };
};
