import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import BN from 'bn.js';
import * as nearAPI from 'near-api-js';
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

  const connectToNear = async (callbackUrl?: string): Promise<NearConnectResponseProps | null> => {
    const {near, wallet} = await nearInitialize();

    return connectToNearWallet(near, wallet, callbackUrl);
  };

  const getNearBalanceDetail = async (): Promise<NearBalanceProps> => {
    const {near, wallet} = await nearInitialize();
    const balance = getNearBalance(near, wallet.getAccountId());
    return balance;
  };

  const getEstimatedFee = async (): Promise<{gasPrice: string}> => {
    const {near} = await nearInitialize();
    const blockStatus = await near.connection.provider.status();
    const gas = await near.connection.provider.gasPrice(blockStatus.sync_info.latest_block_hash);
    const gasPrice = nearAPI.utils.format.formatNearAmount(gas.gas_price);
    return {gasPrice};
  };

  const sendAmount = async (
    receiver: string,
    amount: BN,
    callback?: (hash: string) => void,
  ): Promise<void> => {
    const {wallet} = await nearInitialize();
    const account = wallet.account();
    await account.sendMoney(receiver, amount);

    callback && callback('test');
  };

  return {
    connectToNear,
    getNearBalanceDetail,
    getEstimatedFee,
    sendAmount,
    balanceDetails,
  };
};
