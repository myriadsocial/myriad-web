import {PaginationState as BasePaginationState} from '../base/state';
import {Actions} from './actions';
import * as constants from './constants';

import * as Redux from 'redux';
import {Transaction} from 'src/interfaces/transaction';

export interface TransactionState extends BasePaginationState {
  transactions: Transaction[];
  inboundTxs: Transaction[];
  outboundTxs: Transaction[];
}

const initalState: TransactionState = {
  loading: false,
  transactions: [],
  inboundTxs: [],
  outboundTxs: [],
  meta: {
    currentPage: 1,
    itemsPerPage: 10,
    totalItemCount: 0,
    totalPageCount: 0,
  },
};

export const TransactionReducer: Redux.Reducer<TransactionState, Actions> = (
  state = initalState,
  action,
) => {
  switch (action.type) {
    case constants.FETCH_TRANSACTIONS: {
      return {
        ...state,
        transactions:
          action.meta.currentPage === 1
            ? action.transactions
            : [...state.transactions, ...action.transactions],
        inboundTxs: action.inboundTxs,
        outboundTxs: action.outboundTxs,
        meta: action.meta,
      };
    }

    default: {
      return state;
    }
  }
};
