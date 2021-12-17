import {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {RootState} from 'src/reducers';
import {fetchExchangeRates} from 'src/reducers/exchange-rate/actions';
import {ExchangeRateState} from 'src/reducers/exchange-rate/reducer';

export const useExchangeRate = () => {
  const dispatch = useDispatch();
  const {exchangeRates} = useSelector<RootState, ExchangeRateState>(
    state => state.exchangeRateState,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      dispatch(fetchExchangeRates());
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    error,
    loading,
    exchangeRates,
    loadExchangeRate: load,
  };
};
