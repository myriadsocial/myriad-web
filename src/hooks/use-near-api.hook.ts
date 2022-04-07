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

  const getEstimatedFee = async (): Promise<{gasPrice: string}> => {
    const {near} = await nearInitialize();
    const blockStatus = await near.connection.provider.status();
    const gas = await near.connection.provider.gasPrice(blockStatus.sync_info.latest_block_hash);
    const gasPrice = nearAPI.utils.format.formatNearAmount(gas.gas_price);
    return {gasPrice};
  };

  const sendAmount = async (callback?: (hash: string) => void): Promise<void> => {
    const networkId = 'testnet';
    const sender = 'parampam.testnet';
    const {keyStores, connect} = nearAPI;
    const memoryKeyStore = new keyStores.InMemoryKeyStore();
    const browserKeyStore = new keyStores.BrowserLocalStorageKeyStore();
    const keypairBrowser = await browserKeyStore.getKey('testnet', sender);
    await memoryKeyStore.setKey(networkId, sender, keypairBrowser);
    const amount = new BN(1);
    console.log(memoryKeyStore);

    const config = {
      networkId,
      keyStore: memoryKeyStore,
      nodeUrl: `https://rpc.${networkId}.near.org`,
      walletUrl: `https://wallet.${networkId}.near.org`,
      helperUrl: `https://helper.${networkId}.near.org`,
      explorerUrl: `https://explorer.${networkId}.near.org`,
      headers: {},
    };

    const nearConnect = await connect(config);
    const senderAccountParampam = await nearConnect.account(sender);

    const result = await senderAccountParampam.sendMoney('chachacha.testnet', amount);
    console.log(result);

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
