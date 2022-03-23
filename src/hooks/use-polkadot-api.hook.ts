import * as Sentry from '@sentry/nextjs';

import {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {BN, BN_ONE, BN_TWO, BN_TEN, formatBalance} from '@polkadot/util';

import {SimpleSendTipProps} from '../interfaces/transaction';
import {setIsTipSent, setFee} from '../reducers/wallet/actions';
import {WalletState} from '../reducers/wallet/reducer';

import _ from 'lodash';
import {useToasterSnackHook} from 'src/hooks/use-toaster-snack.hook';
import {BalanceDetail} from 'src/interfaces/balance';
import {CurrencyId} from 'src/interfaces/currency';
import {storeTransaction} from 'src/lib/api/transaction';
import {estimateFee, signAndSendExtrinsic} from 'src/lib/services/polkadot-js';
import {RootState} from 'src/reducers';
import {fetchBalances} from 'src/reducers/balance/actions';
import {BalanceState} from 'src/reducers/balance/reducer';
import {UserState} from 'src/reducers/user/reducer';
import {setExplorerURL} from 'src/reducers/wallet/actions';

export const usePolkadotApi = () => {
  const dispatch = useDispatch();

  const {anonymous, currencies} = useSelector<RootState, UserState>(state => state.userState);
  const {balanceDetails, loading: loadingBalance} = useSelector<RootState, BalanceState>(
    state => state.balanceState,
  );
  const {isTipSent} = useSelector<RootState, WalletState>(state => state.walletState);

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

  const getEstimatedFee = async (
    from: string,
    to: string,
    currency: BalanceDetail,
  ): Promise<BN | null> => {
    setIsFetchingFee(true);

    try {
      let {partialFee: estimatedFee} = await estimateFee(from, to, currency);

      if (estimatedFee) {
        dispatch(setFee(estimatedFee.toString()));
      } else {
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
    {from, to, amount, currency, type, referenceId}: SimpleSendTipProps,
    callback?: () => void,
  ) => {
    setLoading(true);
    setError(null);

    if (isTipSent) {
      dispatch(setIsTipSent(false));
    }

    try {
      const txHash = await signAndSendExtrinsic(
        {
          from,
          to,
          value: amount,
          currencyId: currency.id,
          wsAddress: currency.rpcURL,
          native: currency.native,
          decimal: currency.decimal,
        },
        params => {
          if (params.signerOpened) {
            setSignerLoading(true);
          }
        },
      );

      if (_.isEmpty(txHash)) {
        throw {
          message: 'Cancelled',
        };
      }

      if (txHash) {
        const formattedAmount = formatBalance(amount, {
          decimals: currency.decimal,
          forceUnit: '-',
          withSi: false,
        });
        // Record the transaction
        if (type) {
          // sending tip from Post/Comment
          await storeTransaction({
            // TODO: should add the extrinsicURL: explorerURL + txHash
            hash: txHash,
            amount: +formattedAmount,
            from,
            to,
            currencyId: currency.id,
            // Optionals for Post or Comment
            type,
            referenceId,
          });
        } else {
          // sending direct tip
          await storeTransaction({
            hash: txHash,
            amount: +formattedAmount,
            from,
            to,
            currencyId: currency.id,
            referenceId,
          });
        }

        dispatch(setIsTipSent(true));

        if (currency.id === CurrencyId.AUSD) {
          const {explorerURL} = currency;
          dispatch(setExplorerURL(`${explorerURL}extrinsic/${txHash}`));
        } else {
          dispatch(setExplorerURL(`${currency.explorerURL}/${txHash}`));
        }

        callback && callback();
      }
    } catch (error) {
      console.error(error);
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
    simplerSendTip,
    getEstimatedFee,
  };
};
