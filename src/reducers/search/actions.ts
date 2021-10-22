import {User} from '../../interfaces/user';
import * as UserAPI from '../../lib/api/user';
import {ThunkActionCreator} from '../../types/thunk';
import {Actions as BaseAction, PaginationAction, setLoading, setError} from '../base/actions';
import {RootState} from '../index';
import * as constants from './constants';

import {Action} from 'redux';

/**
 * Action Types
 */

export interface ResetState extends Action {
  type: constants.RESET_SEARCH_STATE;
}

export interface SearchUsers extends PaginationAction {
  type: constants.SEARCH_USERS;
  users: User[];
}

export interface AbortSearch extends Action {
  type: constants.ABORT_SEARCH;
}

/**
 * Union Action Types
 */
export type Actions = ResetState | SearchUsers | AbortSearch | BaseAction;

/**
 *
 * Actions
 */

/**
 * Action Creator
 */

export const searchUsers: ThunkActionCreator<Actions, RootState> =
  (query: string) => async dispatch => {
    dispatch(setLoading(true));

    try {
      const {meta, data: users} = await UserAPI.searchUsers(query);

      dispatch({
        type: constants.SEARCH_USERS,
        users,
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
