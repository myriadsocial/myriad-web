import {useDispatch} from 'react-redux';

import {BalanceDetail} from 'src/interfaces/balance';
import * as TokenAPI from 'src/lib/api/token';
import {getUserCurrencies} from 'src/reducers/balance/actions';
import {setDefaultCurrency} from 'src/reducers/user/actions';

export const useCurrency = () => {
  const dispatch = useDispatch();

  const fetchUserCurrencies = () => {
    dispatch(getUserCurrencies());
  };

  const updateCurrencySet = async (
    userId: string,
    balanceDetails: BalanceDetail[],
    networkId: string,
    callback?: () => void,
  ) => {
    try {
      dispatch(setDefaultCurrency(balanceDetails));

      const currencyIds = balanceDetails.map(e => e.id);

      await TokenAPI.updateCurrencySet(userId, currencyIds, networkId);

      callback && callback();
    } catch (error) {
      console.log(error);
    }
  };

  return {
    fetchUserCurrencies,
    updateCurrencySet,
  };
};
