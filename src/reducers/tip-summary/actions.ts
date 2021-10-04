import {Actions as BaseAction, PaginationAction, setError, setLoading} from '../base/actions';
import {RootState} from '../index';
import * as constants from './constants';

import {Action} from 'redux';
import {Comment} from 'src/interfaces/comment';
import {CurrencyId} from 'src/interfaces/currency';
import {Post} from 'src/interfaces/post';
import {Transaction, TransactionDetail, TransactionSort} from 'src/interfaces/transaction';
import MyriadAPI from 'src/lib/api/base';
import {BaseList} from 'src/lib/api/interfaces/base-list.interface';
import {ThunkActionCreator} from 'src/types/thunk';

type TransactionList = BaseList<Transaction>;

/**
 * Action Types
 */

export interface SetTippedPost extends Action {
  type: constants.SET_TIPPED_POST;
  payload: Post;
}

export interface ClearTippedContent extends Action {
  type: constants.CLEAR_TIPPED_CONTENT;
}

export interface LoadTransactionHistory extends PaginationAction {
  type: constants.FETCH_TRANSACTION_HISTORY;
  transactions: Transaction[];
}

export interface LoadTransactionSummary extends Action {
  type: constants.FETCH_TRANSACTION_SUMMARY;
  summary: TransactionDetail[];
}

export interface SetTippedComment extends Action {
  type: constants.SET_TIPPED_COMMENT;
  payload: Comment;
}

export interface LoadTransactionHistoryForComment extends PaginationAction {
  type: constants.FETCH_TRANSACTION_HISTORY_FOR_COMMENT;
  transactions: Transaction[];
}

export interface LoadTransactionSummaryForComment extends Action {
  type: constants.FETCH_TRANSACTION_SUMMARY_FOR_COMMENT;
  summary: TransactionDetail[];
}

export interface SetTransactionCurrency extends Action {
  type: constants.SET_TRANSACTION_CURRENCY;
  currency: CurrencyId;
}

export interface SetTransactionSort extends Action {
  type: constants.SET_TRANSACTION_SORT;
  sort: TransactionSort;
}

/**
 * Union Action Types
 */

export type Actions =
  | SetTippedPost
  | LoadTransactionHistory
  | LoadTransactionSummary
  | SetTippedComment
  | LoadTransactionHistoryForComment
  | LoadTransactionSummaryForComment
  | ClearTippedContent
  | SetTransactionCurrency
  | SetTransactionSort
  | BaseAction;

/**
 *
 * Actions
 */
export const setTippedPost = (post: Post): SetTippedPost => ({
  type: constants.SET_TIPPED_POST,
  payload: post,
});

export const clearTippedContent = (): ClearTippedContent => ({
  type: constants.CLEAR_TIPPED_CONTENT,
});

export const setTippedComment = (comment: Comment): SetTippedComment => ({
  type: constants.SET_TIPPED_COMMENT,
  payload: comment,
});

export const setTransactionCurrency = (currency: CurrencyId): SetTransactionCurrency => ({
  type: constants.SET_TRANSACTION_CURRENCY,
  currency,
});

export const setTransactionSort = (sort: TransactionSort): SetTransactionSort => ({
  type: constants.SET_TRANSACTION_SORT,
  sort,
});

export const fetchTransactionHistory: ThunkActionCreator<Actions, RootState> =
  (reference: Post | Comment, type: 'post' | 'comment', page = 1) =>
  async (dispatch, getState) => {
    dispatch(setLoading(true));

    try {
      const {
        userState: {user},
        tipSummaryState: {sort, currency},
      } = getState();

      if (!user) {
        throw new Error('User not found');
      }

      const {data} = await MyriadAPI.request<TransactionList>({
        url: '/transactions',
        method: 'GET',
        params: {
          filter: {
            order: sort === 'highest' ? 'amount DESC' : 'createdAt DESC',
            where: {
              type,
              referenceId: reference.id,
              currencyId: currency ? {eq: currency} : undefined,
            },
            include: ['fromUser', 'toUser'],
          },
          pageNumber: page,
        },
      });

      dispatch({
        type: constants.FETCH_TRANSACTION_HISTORY,
        transactions: data.data,
        meta: data.meta,
      });
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const fetchTransactionSummary: ThunkActionCreator<Actions, RootState> =
  (post: Post) => async (dispatch, getState) => {
    dispatch(setLoading(true));

    try {
      const {
        userState: {user},
      } = getState();

      if (!user) {
        throw new Error('User not found');
      }

      const {data} = await MyriadAPI.request<TransactionDetail[]>({
        url: `/posts/${post.id}/transaction-summary`,
        method: 'GET',
      });

      dispatch({
        type: constants.FETCH_TRANSACTION_SUMMARY,
        summary: data,
      });
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const fetchTransactionHistoryForComment: ThunkActionCreator<Actions, RootState> =
  (page = 1) =>
  async (dispatch, getState) => {
    dispatch(setLoading(true));

    try {
      const {
        userState: {user},
      } = getState();

      const {
        tipSummaryState: {comment},
      } = getState();

      if (!user) {
        throw new Error('User not found');
      }

      if (!comment) {
        throw new Error('Comment not found');
      }

      const {data} = await MyriadAPI.request<TransactionList>({
        url: '/transactions',
        method: 'GET',
        params: {
          filter: {
            order: 'createdAt DESC',
            where: {
              type: 'comment',
              referenceId: comment.id,
            },
            include: ['fromUser', 'toUser'],
          },
          pageNumber: page,
        },
      });

      dispatch({
        type: constants.FETCH_TRANSACTION_HISTORY_FOR_COMMENT,
        transactions: data.data,
        meta: data.meta,
      });
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const fetchTransactionSummaryForComment: ThunkActionCreator<Actions, RootState> =
  () => async (dispatch, getState) => {
    dispatch(setLoading(true));

    try {
      const {
        userState: {user},
      } = getState();
      const {
        tipSummaryState: {comment},
      } = getState();

      if (!user) {
        throw new Error('User not found');
      }

      if (!comment) {
        throw new Error('Comment not found');
      }

      const {data} = await MyriadAPI.request<TransactionDetail[]>({
        url: `/comments/${comment.id}/transaction-summary`,
        method: 'GET',
      });

      dispatch({
        type: constants.FETCH_TRANSACTION_SUMMARY_FOR_COMMENT,
        summary: data,
      });
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };
