import {
  nearInitialize,
  connectToNearWallet,
  getNearBalance,
  NearConnectResponseProps,
  NearBalanceProps,
} from 'src/lib/services/near-api-js';

export const useNearApi = () => {
  const connectToNear = async (): Promise<NearConnectResponseProps> => {
    const {near, wallet} = await nearInitialize();
    const data = connectToNearWallet(near, wallet);

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
  };
};
