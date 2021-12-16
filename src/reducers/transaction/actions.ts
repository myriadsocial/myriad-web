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
  type: constants.FETCH_TRANSACTIONS;
  transactions: Transaction[];
  outboundTxs: Transaction[];
  inboundTxs: Transaction[];
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

      const options = {
        to: user.id,
        from: user.id,
      };

      const {data: transactions, meta} = await TransactionAPI.getTransactions(options);

      if (transactions.length > 0) {
        //Get only transaction related to logged-in user
        const tempData = transactions.filter(function (datum: any) {
          return datum.from === user.id || datum.to === user.id;
        });

        const sortedTempData = tempData.slice().sort((a: any, b: any) => b.createdAt - a.createdAt);
        const inboundTxs = sortedTempData.filter(transaction => {
          return transaction.to === user.id;
        });
        const outboundTxs = sortedTempData.filter(transaction => {
          return transaction.from === user.id;
        });

        console.log({transactions, inboundTxs, outboundTxs});

        dispatch({
          type: constants.FETCH_TRANSACTIONS,
          transactions,
          inboundTxs,
          outboundTxs,
          meta,
        });
      }
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

export const fetchTransactionsIncludingCurrency: ThunkActionCreator<Actions, RootState> =
  (page = 1) =>
  async (dispatch, getState) => {
    dispatch(setLoading(true));

    try {
      const {
        userState: {user},
      } = getState();

      if (!user) {
        throw new Error('User not found');
      }

      const options = {
        to: user.id,
        from: user.id,
      };

      const {data: transactions, meta} = await TransactionAPI.getTransactionsIncludingCurrency(
        options,
        page,
      );

      if (transactions.length > 0) {
        //Get only transaction related to logged-in user
        const tempData = transactions.filter(function (datum: any) {
          return datum.from === user.id || datum.to === user.id;
        });

        const sortedTempData = tempData.slice().sort((a: any, b: any) => b.createdAt - a.createdAt);
        const inboundTxs = sortedTempData.filter(transaction => {
          return transaction.to === user.id;
        });
        const outboundTxs = sortedTempData.filter(transaction => {
          return transaction.from === user.id;
        });

        dispatch({
          type: constants.FETCH_TRANSACTIONS,
          transactions,
          inboundTxs,
          outboundTxs,
          meta,
        });
      }
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
