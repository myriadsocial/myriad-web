import {Actions as BaseAction, PaginationAction, setError, setLoading} from '../base/actions';
import {RootState} from '../index';
import * as constants from './constants';

import {Action} from 'redux';
import {Post} from 'src/interfaces/post';
import {Transaction} from 'src/interfaces/transaction';
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

export interface LoadTransactionHistory extends PaginationAction {
  type: constants.FETCH_TRANSACTION_HISTORY;
  transactions: Transaction[];
}

export interface ClearTippedPost extends Action {
  type: constants.CLEAR_TIPPED_POST;
}

/**
 * Union Action Types
 */

export type Actions = SetTippedPost | LoadTransactionHistory | ClearTippedPost | BaseAction;

/**
 *
 * Actions
 */
export const setTippedPost = (post: Post): SetTippedPost => ({
  type: constants.SET_TIPPED_POST,
  payload: post,
});

export const clearTippedPost = (): ClearTippedPost => ({
  type: constants.CLEAR_TIPPED_POST,
});

export const fetchTransactionHistory: ThunkActionCreator<Actions, RootState> =
  (post: Post, page = 1) =>
  async (dispatch, getState) => {
    dispatch(setLoading(true));

    try {
      const {
        userState: {user},
      } = getState();

      if (!user) {
        throw new Error('User not found');
      }

      const {data} = await MyriadAPI.request<TransactionList>({
        url: '/transactions',
        method: 'GET',
        params: {
          filter: {
            page,
            where: {
              postId: post.id,
            },
          },
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
