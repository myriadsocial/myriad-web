import {HYDRATE} from 'next-redux-wrapper';

import {PaginationState as BasePaginationState} from '../base/state';
import {Actions} from './actions';
import * as constants from './constants';

import * as Redux from 'redux';
import {Comment} from 'src/interfaces/comment';
import {CurrencyId} from 'src/interfaces/currency';
import {Post} from 'src/interfaces/post';
import {Transaction, TransactionDetail, TransactionSort} from 'src/interfaces/transaction';

export interface TipSummaryState extends BasePaginationState {
  reference: Post | Comment | null;
  show: boolean;
  hasMore: boolean;
  transactions: Transaction[];
  summary: TransactionDetail[];
  sort: TransactionSort;
  currency?: CurrencyId;
}

const initialState: TipSummaryState = {
  reference: null,
  loading: false,
  show: false,
  hasMore: false,
  transactions: [],
  summary: [],
  sort: 'highest',
  meta: {
    currentPage: 1,
    itemsPerPage: 10,
    totalItemCount: 0,
    totalPageCount: 0,
  },
};

export const TipSummaryReducer: Redux.Reducer<TipSummaryState, Actions> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case HYDRATE: {
      return action.payload.tipSummaryState;
    }

    case constants.SET_TIPPED_REFERENCE: {
      return {
        ...state,
        reference: action.payload,
        show: true,
      };
    }

    case constants.FETCH_TRANSACTION_HISTORY: {
      return {
        ...state,
        transactions:
          !action.meta.currentPage || action.meta.currentPage === 1
            ? action.transactions
            : [...state.transactions, ...action.transactions],
        meta: action.meta,
        hasMore: action.meta.currentPage < action.meta.totalPageCount,
      };
    }

    case constants.FETCH_TRANSACTION_SUMMARY: {
      return {
        ...state,
        summary: action.summary,
      };
    }

    case constants.FETCH_TRANSACTION_HISTORY_FOR_COMMENT: {
      return {
        ...state,
        transactions: action.transactions,
        meta: action.meta,
        hasMore: action.meta.currentPage < action.meta.totalPageCount,
      };
    }

    case constants.FETCH_TRANSACTION_SUMMARY_FOR_COMMENT: {
      return {
        ...state,
        summary: action.summary,
        show: true,
      };
    }

    case constants.SET_TRANSACTION_SORT: {
      return {
        ...state,
        sort: action.sort,
      };
    }

    case constants.SET_TRANSACTION_CURRENCY: {
      return {
        ...state,
        currency: action.currency,
      };
    }

    case constants.CLEAR_TIPPED_CONTENT: {
      return initialState;
    }

    default: {
      return state;
    }
  }
};
