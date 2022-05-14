import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import BN from 'bn.js';
import * as nearAPI from 'near-api-js';
import {
  nearInitialize,
  connectToNearWallet,
  NearConnectResponseProps,
  contractInitialize,
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
      currentWallet?.network?.blockchainPlatform === 'near'
    ) {
      dispatch(fetchBalances());
    }
  }, [anonymous, currencies, balanceDetails, currentWallet]);

  const connectToNear = async (callbackUrl?: string): Promise<NearConnectResponseProps | null> => {
    const {near, wallet} = await nearInitialize();

    return connectToNearWallet(near, wallet, callbackUrl);
  };

  const getEstimatedFee = async (): Promise<{gasPrice: string}> => {
    const {near} = await nearInitialize();
    const blockStatus = await near.connection.provider.status();
    const gas = await near.connection.provider.gasPrice(blockStatus.sync_info.latest_block_hash);
    const gasPrice = nearAPI.utils.format.formatNearAmount(gas.gas_price);
    return {gasPrice};
  };

  const sendAmount = async (receiver: string, amount: BN, referenceId?: string): Promise<void> => {
    const {wallet} = await nearInitialize();
    const account = wallet.account();
    if (referenceId) {
      const ONE_YOCTO = '1';
      const MAX_GAS = '300000000000000';
      const ATTACHED_AMOUNT = '1250000000000000000000';
      const ATTACHED_GAS = '10000000000000';
      const contract = await contractInitialize(referenceId);
      const action: nearAPI.transactions.Action[] = [];
      const isDeposit = await contract.storage_balance_of({account_id: receiver});
      if (!isDeposit) {
        action.push(
          nearAPI.transactions.functionCall(
            'storage_deposit',
            Buffer.from(JSON.stringify({account_id: receiver})),
            new BN(ATTACHED_GAS),
            new BN(ATTACHED_AMOUNT),
          ),
        );
      }
      action.push(
        nearAPI.transactions.functionCall(
          'ft_transfer',
          Buffer.from(JSON.stringify({receiver_id: receiver, amount: amount.toString()})),
          new BN(MAX_GAS).sub(new BN(ATTACHED_GAS)),
          new BN(ONE_YOCTO),
        ),
      );
      //TODO: fix error protected class for multiple sign and send transactions
      // @ts-ignore: protected class
      await wallet.account().signAndSendTransaction({receiverId: referenceId, actions: action});
    } else {
      await account.sendMoney(receiver, amount);
    }
  };

  return {
    connectToNear,
    getEstimatedFee,
    sendAmount,
    balanceDetails,
  };
};
