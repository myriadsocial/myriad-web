import * as Sentry from '@sentry/nextjs';

import {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {BN, BN_ONE, BN_TWO, BN_TEN} from '@polkadot/util';

import {SimpleSendTipProps} from '../interfaces/transaction';
import {setIsTipSent, setFee} from '../reducers/wallet/actions';
import {WalletState} from '../reducers/wallet/reducer';

import _ from 'lodash';
import {formatBalance} from 'src/helpers/balance';
import {useToasterSnackHook} from 'src/hooks/use-toaster-snack.hook';
import {BalanceDetail} from 'src/interfaces/balance';
import {CurrencyId} from 'src/interfaces/currency';
import {WalletDetail, WalletReferenceType} from 'src/interfaces/wallet';
import {WalletTypeEnum} from 'src/lib/api/ext-auth';
import {storeTransaction} from 'src/lib/api/transaction';
import {TransactionCanceledException} from 'src/lib/services/errors/TransactionCanceledException';
import {estimateFee, signAndSendExtrinsic} from 'src/lib/services/polkadot-js';
import {RootState} from 'src/reducers';
import {fetchBalances} from 'src/reducers/balance/actions';
import {BalanceState} from 'src/reducers/balance/reducer';
import {UserState} from 'src/reducers/user/reducer';
import {setExplorerURL} from 'src/reducers/wallet/actions';

export const usePolkadotApi = () => {
  const dispatch = useDispatch();

  const {anonymous, currencies, currentWallet} = useSelector<RootState, UserState>(
    state => state.userState,
  );
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
    if (
      !anonymous &&
      currencies.length > 0 &&
      balanceDetails.length === 0 &&
      currentWallet?.type === WalletTypeEnum.POLKADOT
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
    let estimatedFee: BN;

    try {
      const result = await estimateFee(from, walletDetail, currency);

      if (result?.partialFee) {
        estimatedFee = result.partialFee;
        dispatch(setFee(result.partialFee.toString()));
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
    {from, amount, currency, type, referenceId, walletDetail}: SimpleSendTipProps,
    callback?: (hash: string) => void,
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

      if (_.isEmpty(txHash)) {
        throw TransactionCanceledException;
      }

      if (txHash) {
        const finalAmount = formatBalance(amount, currency.decimal);
        const to =
          walletDetail.referenceType === WalletReferenceType.WALLET_ADDRESS
            ? walletDetail.referenceId
            : undefined;

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

        dispatch(setIsTipSent(true));

        if (currency.id === CurrencyId.AUSD) {
          const {network} = currency;
          dispatch(setExplorerURL(`${network.explorerURL}extrinsic/${txHash}`));
        } else {
          dispatch(setExplorerURL(`${currency.network.explorerURL}/${txHash}`));
        }

        callback && callback(txHash);
      }
    } catch (error) {
      if (error instanceof TransactionCanceledException) {
        openToasterSnack({
          variant: 'warning',
          message: 'Transaction signing cancelled',
        });
      }

      if (error instanceof Error) {
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
