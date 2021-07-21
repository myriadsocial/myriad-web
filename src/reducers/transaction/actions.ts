import {Actions as BaseAction, setLoading, setError} from '../base/actions';
import {RootState} from '../index';
import * as constants from './constants';

import {Action} from 'redux';
import {Transaction} from 'src/interfaces/transaction';
import * as TransactionAPI from 'src/lib/api/transaction';
import {ThunkActionCreator} from 'src/types/thunk';

/**
 * Action Types
 */

export interface FetchTransaction extends Action {
  type: constants.FETCH_TRANSACTION;
  transactions: Transaction[];
}

/**
 * Union Action Types
 */

export type Actions = FetchTransaction | BaseAction;

/**
 *
 * Actions
 */

/**
 * Action Creator
 */
export const fetchTransaction: ThunkActionCreator<Actions, RootState> =
  () => async (dispatch, getState) => {
    dispatch(setLoading(true));

    try {
      const {
        userState: {user},
      } = getState();

      if (!user) {
        throw new Error('User not found');
      }

      const transactions = await TransactionAPI.getTransaction({
        to: user.id,
      });

      dispatch({
        type: constants.FETCH_TRANSACTION,
        transactions,
      });
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };
