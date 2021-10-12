import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {Status} from '../interfaces/toaster';
import {SimpleSendTipProps} from '../interfaces/transaction';
import {showToaster} from '../reducers/toaster/actions';

import _ from 'lodash';
import {useTipSummaryHook} from 'src/components/tip-summary/use-tip-summary.hook';
import {useAlertHook} from 'src/hooks/use-alert.hook';
import {Currency} from 'src/interfaces/currency';
import {SendTipProps} from 'src/interfaces/send-tips/send-tips';
import {ContentType} from 'src/interfaces/wallet';
import {storeTransaction} from 'src/lib/api/transaction';
import {signAndSendExtrinsic} from 'src/lib/services/polkadot-js';
import {RootState} from 'src/reducers';
import {fetchBalances} from 'src/reducers/balance/actions';
import {BalanceState} from 'src/reducers/balance/reducer';

export const usePolkadotApi = () => {
  const dispatch = useDispatch();
  const balanceState = useSelector<RootState, BalanceState>(state => state.balanceState);
  const {showAlert, showTipAlert} = useAlertHook();
  const {openTipSummaryForComment} = useTipSummaryHook();

  const [loading, setLoading] = useState(false);
  const [isSignerLoading, setSignerLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async (address: string, availableTokens: Currency[]) => {
    dispatch(fetchBalances(address, availableTokens));
  };

  const sendTip = async (
    {from, to, value, decimals, currencyId, referenceId, contentType, wsAddress}: SendTipProps,
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
            //type: ContentType.POST,
            //referenceId,
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

  const simplerSendTip = async (
    {from, to, amount, currency, type, referenceId}: SimpleSendTipProps,
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
          value: amount,
          currencyId: currency.id,
          wsAddress: currency.rpcURL,
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

        //openTipSummaryForComment();

        dispatch(
          showToaster({
            toasterStatus: Status.SUCCESS,
            message: 'Tip sent!',
          }),
        );
        callback && callback();
      }
    } catch (error) {
      if (error.message === 'Cancelled') {
        dispatch(
          showToaster({
            toasterStatus: Status.WARNING,
            message: 'Transaction signing cancelled',
          }),
        );
      }
    } finally {
      setLoading(false);
      setSignerLoading(false);
    }
  };

  return {
    loadingBalance: balanceState.loading,
    loading,
    isSignerLoading,
    error,
    load,
    sendTip,
    simplerSendTip,
  };
};
