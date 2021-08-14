import {Actions as BaseAction, PaginationAction, setLoading, setError} from '../base/actions';
import {RootState} from '../index';
import * as constants from './constants';

import {Transaction} from 'src/interfaces/transaction';
import * as TransactionAPI from 'src/lib/api/transaction';
import {ThunkActionCreator} from 'src/types/thunk';

/**
 * Action Types
 */

export interface FetchTransactions extends PaginationAction {
  type: constants.FETCH_TRANSACTION;
  transactions: Transaction[];
}

/**
 * Union Action Types
 */

export type Actions = FetchTransactions | BaseAction;

/**
 *
 * Actions
 */

/**
 * Action Creator
 */
export const fetchTransactions: ThunkActionCreator<Actions, RootState> =
  () => async (dispatch, getState) => {
    dispatch(setLoading(true));

    try {
      const {
        userState: {user},
      } = getState();

      if (!user) {
        throw new Error('User not found');
      }

      const {data: transactions, meta} = await TransactionAPI.getTransactions({
        to: user.id,
      });

      dispatch({
        type: constants.FETCH_TRANSACTION,
        transactions,
        meta,
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
