import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import _ from 'lodash';
import {useAlertHook} from 'src/hooks/use-alert.hook';
import {SendTipProps} from 'src/interfaces/send-tips/send-tips';
import {Token} from 'src/interfaces/token';
import {ContentType} from 'src/interfaces/wallet';
import {updateTips} from 'src/lib/api/post';
import {storeTransaction} from 'src/lib/api/transaction';
import {signAndSendExtrinsic} from 'src/lib/services/polkadot-js';
import {RootState} from 'src/reducers';
import {fetchBalances} from 'src/reducers/balance/actions';
import {BalanceState} from 'src/reducers/balance/reducer';

export const usePolkadotApi = () => {
  const dispatch = useDispatch();
  const balanceState = useSelector<RootState, BalanceState>(state => state.balanceState);
  const {showAlert, showTipAlert} = useAlertHook();

  const [loading, setLoading] = useState(false);
  const [isSignerLoading, setSignerLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async (address: string, availableTokens: Token[]) => {
    dispatch(fetchBalances(address, availableTokens));
  };

  const sendTip = async (
    {from, to, value, decimals, currencyId, postId, contentType, wsAddress}: SendTipProps,
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

      console.log({from, to, value, currencyId, wsAddress});

      console.log({txHash});

      if (_.isEmpty(txHash)) {
        throw {
          message: 'Cancelled',
        };
      }

      if (txHash) {
        const correctedValue = value / 10 ** decimals;
        // Record the transaction
        // TODO: adjust to the new DB scheme
        await storeTransaction({
          hash: txHash,
          from,
          to,
          amount: correctedValue,
          currencyId: currencyId,
          postId,
        });

        showTipAlert({
          severity: 'success',
          title: 'Tip sent!',
          message: `${txHash}`,
        });

        callback && callback();
      }
    } catch (error) {
      console.log({error});
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

  return {
    loadingBalance: balanceState.loading,
    loading,
    isSignerLoading,
    error,
    load,
    sendTip,
  };
};
