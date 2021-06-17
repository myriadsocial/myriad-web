import { useState } from 'react';

import { useBalance as baseUseBalance, BalanceActionType } from './balance.context';

import { getBalance } from 'src/helpers/polkadotApi';

//import { BalanceDetail } from 'src/interfaces/balance';

export const useBalance = (userId: string, wsProvider: string) => {
  const { state } = baseUseBalance();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async (type: BalanceActionType = BalanceActionType.INIT_BALANCE) => {
    setLoading(true);
    try {
      const resp = await getBalance(userId, wsProvider);

      if (resp) {
        console.log('the response: ', resp);
        //dispatch({
        //type: BalanceActionType.INIT_BALANCE,
        //balanceDetails: resp.map((item: BalanceDetail) => ({ ...item }))
        ////freeBalance: Number(Number(resp / 100).toFixed(3))
        //});
      }
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  };

  return {
    error,
    loading,
    balanceDetails: state.balanceDetails,
    loadInitBalance: load
  };
};
