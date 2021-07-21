import {State as BaseState} from '../base/state';
import {Actions} from './actions';
import * as constants from './constants';

import * as Redux from 'redux';
import {Transaction} from 'src/interfaces/transaction';

export interface TransactionState extends BaseState {
  transactions: Transaction[];
}

const initalState: TransactionState = {
  loading: false,
  transactions: [],
};

export const TransactionReducer: Redux.Reducer<TransactionState, Actions> = (
  state = initalState,
  action,
) => {
  switch (action.type) {
    case constants.FETCH_TRANSACTION: {
      return {
        ...state,
        transactions: action.transactions,
      };
    }

    default: {
      return state;
    }
  }
};
