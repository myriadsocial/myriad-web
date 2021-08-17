import {Actions as BaseAction, setLoading, setError} from '../base/actions';
import {RootState} from '../index';
import * as constants from './constants';

import {Action} from 'redux';
import {Currency} from 'src/interfaces/currency';
import * as TokenAPI from 'src/lib/api/token';
import {ThunkActionCreator} from 'src/types/thunk';

/**
 * Action Types
 */

export interface FetchAvailableToken extends Action {
  type: constants.FETCH_AVAILABLE_TOKEN;
  payload: Currency[];
}

/**
 * Union Action Types
 */

export type Actions = FetchAvailableToken | BaseAction;

/**
 *
 * Actions
 */

/**
 * Action Creator
 */
export const fetchAvailableToken: ThunkActionCreator<Actions, RootState> = () => async dispatch => {
  dispatch(setLoading(true));

  try {
    const {data: currencies} = await TokenAPI.getTokens();

    dispatch({
      type: constants.FETCH_AVAILABLE_TOKEN,
      payload: currencies,
    });
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};
