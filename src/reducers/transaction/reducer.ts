import {PaginationState as BasePaginationState} from '../base/state';
import {Actions, TransactionFilterProps} from './actions';
import * as constants from './constants';

import update from 'immutability-helper';
import * as Redux from 'redux';
import {Transaction} from 'src/interfaces/transaction';
import {PaginationParams} from 'src/lib/api/interfaces/pagination-params.interface';

export interface TransactionState extends BasePaginationState {
  transactions: Transaction[];
  filter: TransactionFilterProps;
  pagination?: PaginationParams;
}

const initalState: TransactionState = {
  loading: true,
  transactions: [],
  filter: {},
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
          !action.meta.currentPage || action.meta.currentPage === 1
            ? action.transactions
            : [...state.transactions, ...action.transactions],
        meta: action.meta,
      };
    }

    case constants.SET_TRANSACTION_FILTER: {
      return {
        ...state,
        filter: {
          ...state.filter,
          from: action.filter.from,
          to: action.filter.to,
          currencyId: action.filter.currencyId,
        },
      };
    }

    case constants.SET_TRANSACTION_SORT: {
      return {
        ...state,
        pagination: {
          ...state.pagination,
          orderField: action.orderField,
          sort: action.sort,
        },
      };
    }

    case constants.SET_TRANSACTION_LOADING: {
      return update(state, {
        loading: {$set: action.loading},
      });
    }

    default: {
      return state;
    }
  }
};
