import {HYDRATE} from 'next-redux-wrapper';

import {State as BaseState} from '../base/state';
import {Actions} from './actions';
import * as constants from './constants';

import * as Redux from 'redux';
import {BalanceDetail} from 'src/interfaces/balance';

export interface BalanceState extends BaseState {
  balanceDetails: BalanceDetail[];
}

const initialState: BalanceState = {
  loading: false,
  balanceDetails: [],
};

export const BalanceReducer: Redux.Reducer<BalanceState, Actions> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case HYDRATE: {
      return action.payload.balanceState;
    }

    case constants.INIT_BALANCE: {
      return {
        ...state,
        balanceDetails: action.balanceDetails,
      };
    }

    default: {
      return state;
    }
  }
};
