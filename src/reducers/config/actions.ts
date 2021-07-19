import { Actions as BaseAction, setLoading, setError } from '../base/actions';
import { RootState } from '../index';
import * as constants from './constants';

import { Action } from 'redux';
import { Token } from 'src/interfaces/token';
import * as TokenAPI from 'src/lib/api/token';
import { ThunkActionCreator } from 'src/types/thunk';

/**
 * Action Types
 */

export interface FetchAvailableToken extends Action {
  type: constants.FETCH_AVAILABLE_TOKEN;
  payload: Token[];
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
export const fetchToken: ThunkActionCreator<Actions, RootState> = () => async dispatch => {
  dispatch(setLoading(true));

  try {
    const tokens = await TokenAPI.getTokens();

    dispatch({
      type: constants.FETCH_AVAILABLE_TOKEN,
      payload: tokens
    });
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};
