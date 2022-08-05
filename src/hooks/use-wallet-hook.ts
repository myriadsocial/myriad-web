import * as Sentry from '@sentry/nextjs';

import {useState} from 'react';

import {BN, BN_ONE, BN_TWO, BN_TEN, BN_ZERO} from '@polkadot/util';

import useBlockchain from 'components/common/Blockchain/use-blockchain.hook';
import {useEnqueueSnackbar} from 'components/common/Snackbar/useEnqueueSnackbar.hook';
import {formatBalance} from 'src/helpers/balance';
import {BalanceDetail} from 'src/interfaces/balance';
import {WalletDetail} from 'src/interfaces/wallet';
import {storeTransaction} from 'src/lib/api/transaction';
import i18n from 'src/locale';

export const useWallet = () => {
  const enqueueSnackbar = useEnqueueSnackbar();

  const [loading, setLoading] = useState<boolean>(false);
  const [isSignerLoading, setSignerLoading] = useState<boolean>(false);
  const [isFetchingFee, setIsFetchingFee] = useState(false);

  const {server, provider} = useBlockchain();

  const getEstimatedFee = async (
    walletDetail: WalletDetail,
    currency: BalanceDetail,
  ): Promise<{estimatedFee: BN | null; minBalance: BN | null}> => {
    setIsFetchingFee(true);

    try {
      let [{partialFee: minBalance}, {partialFee: estimatedFee}] = await Promise.all([
        await provider.assetMinBalance(currency?.referenceId),
        await provider.estimateFee(walletDetail),
      ]);

      if (!estimatedFee) {
        // equal 0.01
        estimatedFee = BN_ONE.mul(BN_TEN.pow(new BN(currency.decimal))).div(BN_TEN.pow(BN_TWO));
      }

      if (!minBalance) {
        minBalance = BN_ZERO;
      }

      return {estimatedFee, minBalance};
    } catch (error) {
      Sentry.captureException(error);
      return null;
    } finally {
      setIsFetchingFee(false);
    }
  };

  const sendTip = async (
    walletDetail: WalletDetail,
    amount: BN,
    currency: BalanceDetail,
    type?: string,
    referenceId?: string,
    callback?: (txHash: string) => void,
  ) => {
    setLoading(true);

    try {
      const from = provider.accountId;
      const to = walletDetail.referenceId;
      const txHash = await provider.signTippingTransaction(
        walletDetail,
        amount,
        currency?.referenceId,
        undefined,
        params => {
          if (params?.signerOpened) {
            setSignerLoading(true);
          }
        },
      );

      if (txHash) {
        const finalAmount = formatBalance(amount, currency.decimal);
        const txData = {hash: txHash, amount: finalAmount, from, to, currencyId: currency.id};

        if (type) Object.assign(txData, {type});
        if (referenceId) Object.assign(txData, {referenceId});

        // Record the transaction
        await storeTransaction(txData);

        callback && callback(txHash);
      }
    } catch (error) {
      const variant = error.message === 'Cancelled' ? 'warning' : 'error';
      const message = variant === 'warning' ? i18n.t('Tipping.Toaster.Cancelled') : error.message;

      enqueueSnackbar({variant, message});
    } finally {
      setLoading(false);
      setSignerLoading(false);
    }
  };

  return {
    loading,
    isSignerLoading,
    isFetchingFee,
    sendTip,
    getEstimatedFee,
    server,
  };
};
