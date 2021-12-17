import {Actions} from './actions';
import * as constants from './constants';

import * as Redux from 'redux';
import {ExchangeRate} from 'src/interfaces/exchange';

export interface ExchangeRateState {
  exchangeRates: ExchangeRate[];
  loading: boolean;
  error?: string;
}

const initialState: ExchangeRateState = {
  loading: false,
  exchangeRates: [],
};

export const ExchangeRateReducer: Redux.Reducer<ExchangeRateState, Actions> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case constants.FETCH_EXCHANGE_RATES: {
      return {
        ...state,
        exchangeRates: action.exchangeRates,
      };
    }

    default: {
      return state;
    }
  }
};
