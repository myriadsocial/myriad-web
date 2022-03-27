import {Actions as BaseAction, PaginationAction, setError} from '../base/actions';
import {RootState} from '../index';
import * as constants from './constants';

import {Action} from 'redux';
import {Transaction, TransactionOrderType} from 'src/interfaces/transaction';
import {SortType} from 'src/lib/api/interfaces/pagination-params.interface';
import * as TransactionAPI from 'src/lib/api/transaction';
import {ThunkActionCreator} from 'src/types/thunk';

export type TransactionFilterProps = {
  from?: string;
  to?: string;
  currencyId?: string;
};

/**
 * Action Types
 */

export interface FetchTransactions extends PaginationAction {
  type: constants.FETCH_TRANSACTIONS;
  transactions: Transaction[];
}

export interface SetTransactionFilter extends Action {
  type: constants.SET_TRANSACTION_FILTER;
  filter: TransactionFilterProps;
}

export interface SetTransactionSort extends Action {
  type: constants.SET_TRANSACTION_SORT;
  orderField: string;
  sort?: SortType;
}

export interface TransactionLoading extends Action {
  type: constants.SET_TRANSACTION_LOADING;
  loading: boolean;
}

/**
 * Union Action Types
 */

export type Actions =
  | FetchTransactions
  | SetTransactionFilter
  | SetTransactionSort
  | TransactionLoading
  | BaseAction;

/**
 *
 * Actions
 */
export const setTransactionFilter = (filter: TransactionFilterProps): SetTransactionFilter => ({
  type: constants.SET_TRANSACTION_FILTER,
  filter,
});

export const setTransactionLoading = (loading: boolean): TransactionLoading => ({
  type: constants.SET_TRANSACTION_LOADING,
  loading,
});

/**
 * Action Creator
 */
export const setTransactionSort: ThunkActionCreator<Actions, RootState> =
  (order: TransactionOrderType) => async dispatch => {
    let orderField = 'createdAt';
    let sort: SortType = 'DESC';

    switch (order) {
      case TransactionOrderType.HIGHEST:
        orderField = 'amount';
        sort = 'DESC';
        break;
      case TransactionOrderType.LOWEST:
        orderField = 'amount';
        sort = 'ASC';
        break;
      default:
        orderField = 'createdAt';
        sort = 'DESC';
        break;
    }

    dispatch({
      type: constants.SET_TRANSACTION_SORT,
      sort,
      orderField,
    });
  };

export const fetchTransactions: ThunkActionCreator<Actions, RootState> =
  (page = 1) =>
  async (dispatch, getState) => {
    dispatch(setTransactionLoading(true));

    try {
      const {
        userState: {user, currentWallet},
        transactionState: {filter, pagination},
      } = getState();

      if (!user) {
        throw new Error('User not found');
      }

      if (!currentWallet) {
        throw new Error('current wallet not found');
      }

      const {data: transactions, meta} = await TransactionAPI.getTransactions(filter, {
        ...pagination,
        page,
      });

      dispatch({
        type: constants.FETCH_TRANSACTIONS,
        transactions,
        meta,
      });
    } catch (error) {
      dispatch(setError(error));
    } finally {
      dispatch(setTransactionLoading(false));
    }
  };
