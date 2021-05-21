import { useState } from 'react';

import { getBalance } from '../../helpers/polkadotApi';
import { useBalance as baseUseBalance, BalanceActionType } from './balance.context';

export const useBalance = (userId: string) => {
  const { state, dispatch } = baseUseBalance();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async (type: BalanceActionType = BalanceActionType.INIT_BALANCE) => {
    setLoading(true);
    try {
      const resp = await getBalance(userId);

      if (resp) {
        dispatch({
          type: BalanceActionType.INIT_BALANCE,
          freeBalance: Number(Number(resp / 100).toFixed(3))
        });
      }
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  };

  return {
    error,
    loading,
    freeBalance: state.freeBalance,
    loadInitBalance: load
  };
};
