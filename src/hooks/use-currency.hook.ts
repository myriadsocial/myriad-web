import {useDispatch} from 'react-redux';

import {CurrencyId} from 'src/interfaces/currency';
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
    currenciesId: string[],
    callback?: () => void,
  ) => {
    try {
      const primaryCoinId = currenciesId[0] as CurrencyId;

      await TokenAPI.updateCurrencySet(userId, currenciesId);

      dispatch(setDefaultCurrency(primaryCoinId));
      fetchUserCurrencies();

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
