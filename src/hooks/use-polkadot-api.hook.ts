import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import _ from 'lodash';
import {useAlertHook} from 'src/hooks/use-alert.hook';
import {SendTipProps} from 'src/interfaces/send-tips/send-tips';
import {Token} from 'src/interfaces/token';
import {ContentType} from 'src/interfaces/wallet';
import {signAndSendExtrinsic} from 'src/lib/api/polkadot-js';
import {updateTips} from 'src/lib/api/post';
import {storeTransaction} from 'src/lib/api/transaction';
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

      console.log({from, to, value, currencyId, wsAddress});

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

      console.log({txHash});

      if (_.isEmpty(txHash)) {
        //TODO: need to reset this everytime sendTip is called
        throw {
          message: 'Cancelled',
        };
      }

      if (txHash) {
        // Only update the tip sent to a post, but
        // not to a comment
        // TODO: try sending tip from comment
        if (contentType === ContentType.POST) {
          await updateTips(currencyId, value, postId);
        }

        const correctedValue = value / 10 ** decimals;
        // Record the transaction
        // TODO: adjust to the new DB scheme
        await storeTransaction({
          trxHash: txHash,
          from,
          to,
          value: correctedValue,
          state: 'success',
          tokenId: currencyId,
          createdAt: new Date().toISOString(),
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
      if (error.message === 'Cancelled') {
        console.count('cancelled');
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
