import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {WalletTypeEnum} from 'src/lib/api/ext-auth';
import {
  nearInitialize,
  connectToNearWallet,
  getNearBalance,
  NearConnectResponseProps,
  NearBalanceProps,
} from 'src/lib/services/near-api-js';
import {RootState} from 'src/reducers';
import {fetchBalances} from 'src/reducers/balance/actions';
import {BalanceState} from 'src/reducers/balance/reducer';
import {UserState} from 'src/reducers/user/reducer';

export const useNearApi = () => {
  const dispatch = useDispatch();

  const {anonymous, currencies, currentWallet} = useSelector<RootState, UserState>(
    state => state.userState,
  );
  const {balanceDetails} = useSelector<RootState, BalanceState>(state => state.balanceState);

  useEffect(() => {
    if (
      !anonymous &&
      currencies.length > 0 &&
      balanceDetails.length === 0 &&
      currentWallet?.type === WalletTypeEnum.NEAR
    ) {
      dispatch(fetchBalances());
    }
  }, [anonymous, currencies, balanceDetails, currentWallet]);

  const connectToNear = async (callbackUrl?: string): Promise<NearConnectResponseProps> => {
    const {near, wallet} = await nearInitialize();

    const data = await connectToNearWallet(near, wallet, callbackUrl);

    return data;
  };

  const getNearBalanceDetail = async (): Promise<NearBalanceProps> => {
    const {near, wallet} = await nearInitialize();
    const balance = getNearBalance(near, wallet.getAccountId());
    return balance;
  };

  return {
    connectToNear,
    getNearBalanceDetail,
    balanceDetails,
  };
};
