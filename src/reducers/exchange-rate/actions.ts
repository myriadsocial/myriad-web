import {Actions as BaseAction, setLoading, setError} from '../base/actions';
import {RootState} from '../index';
import * as constants from './constants';

import {ExchangeRate} from 'src/interfaces/exchange';
import * as ExchangeRateApi from 'src/lib/api/exchange';
import {ThunkActionCreator} from 'src/types/thunk';

export interface FetchExchangeRates {
  type: constants.FETCH_EXCHANGE_RATES;
  exchangeRates: ExchangeRate[];
}

export type Actions = FetchExchangeRates | BaseAction;

export const fetchExchangeRates: ThunkActionCreator<Actions, RootState> = () => async dispatch => {
  dispatch(setLoading(true));

  try {
    const exchangeRates = await ExchangeRateApi.getExchangeRate();

    dispatch({
      type: constants.FETCH_EXCHANGE_RATES,
      exchangeRates,
    });
  } catch (error) {
    dispatch(
      setError({
        message: error.message,
      }),
    );
  } finally {
    dispatch(setLoading(false));
  }
};
