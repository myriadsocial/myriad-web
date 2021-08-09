import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

//TODO: migrate these two contexts to redux
import {
  useWalletAddress as baseUseWalletAddress,
  WalletAddressActionType,
} from '../components/common/sendtips/send-tip.context';

import _ from 'lodash';
import {useAlertHook} from 'src/hooks/use-alert.hook';
import {Token} from 'src/interfaces/token';
import {ContentType} from 'src/interfaces/wallet';
import {signAndSendExtrinsic} from 'src/lib/api/polkadot-js';
import {updateTips} from 'src/lib/api/post';
import {storeTransaction} from 'src/lib/api/transaction';
import {RootState} from 'src/reducers';
import {fetchBalances} from 'src/reducers/balance/actions';
import {BalanceState} from 'src/reducers/balance/reducer';

type Props = {
  fromAddress: string;
  toAddress: string;
  amountSent: number;
  decimals: number;
  currencyId: string;
  postId: string;
  contentType: ContentType;
  wsAddress: string;
};

// params mungkin butuh address sama tipe wsProvider
export const usePolkadotApi = () => {
  const dispatch = useDispatch();
  const balanceState = useSelector<RootState, BalanceState>(state => state.balanceState);
  const {showAlert, showTipAlert} = useAlertHook();
  //TODO: move to transaction redux
  const {state: walletAddressState, dispatch: walletAddressDispatch} = baseUseWalletAddress();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async (address: string, availableTokens: Token[]) => {
    dispatch(fetchBalances(address, availableTokens));
  };

  const sendTip = async (
    {
      fromAddress,
      toAddress,
      amountSent,
      decimals,
      currencyId,
      postId,
      contentType,
      wsAddress,
    }: Props,
    callback?: () => void,
  ) => {
    walletAddressDispatch({
      type: WalletAddressActionType.INIT_SEND_TIPS,
    });

    setLoading(true);
    try {
      const txHash = await signAndSendExtrinsic({
        fromAddress,
        toAddress,
        amount: amountSent,
        currencyId,
        wsAddress,
      });

      if (_.isEmpty(txHash)) {
        throw {
          message: 'Cancelled',
        };
      }

      if (txHash) {
        // Only update the tip sent to a post, but
        // not to a comment
        // TODO: try sending tip from comment
        if (contentType === ContentType.POST) {
          await updateTips(currencyId, amountSent, postId);
        }

        const correctedValue = amountSent / 10 ** decimals;
        // Record the transaction
        // TODO: adjust to the new DB scheme
        await storeTransaction({
          trxHash: txHash,
          from: fromAddress,
          to: toAddress,
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
        showAlert({
          severity: 'warning',
          title: 'Aborted!',
          message: 'Transaction signing cancelled',
        });
      }
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loadingBalance: balanceState.loading,
    loading,
    error,
    load,
    sendTip,
    // TODO: define sendTipSuccess and txHash on transaction redux
    sendTipSuccess: walletAddressState.success,
    trxHash: walletAddressState.trxHash,
  };
};
