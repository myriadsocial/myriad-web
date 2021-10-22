import {User} from '../../interfaces/user';
import * as UserAPI from '../../lib/api/user';
import {ThunkActionCreator} from '../../types/thunk';
import {Actions as BaseAction, PaginationAction, setLoading, setError} from '../base/actions';
import {RootState} from '../index';
import * as constants from './constants';

import {Action} from 'redux';
import {ListMeta} from 'src/lib/api/interfaces/base-list.interface';

/**
 * Action Types
 */

export interface ResetState extends Action {
  type: constants.RESET_SEARCH_STATE;
}

export interface LoadUsers extends Action {
  type: constants.LOAD_USERS;
  payload: {
    users: User[];
    meta: ListMeta;
  };
}

export interface SetSearchedUsers extends PaginationAction {
  type: constants.SET_SEARCHED_USERS;
  users: User[];
}

export interface AbortSearch extends Action {
  type: constants.ABORT_SEARCH;
}

/**
 * Union Action Types
 */
export type Actions = ResetState | LoadUsers | SetSearchedUsers | AbortSearch | BaseAction;

/**
 *
 * Actions
 */

export const setSearchedUsers = (users: User[], meta: ListMeta): SetSearchedUsers => ({
  type: constants.SET_SEARCHED_USERS,
  users,
  meta,
});

/**
 * Action Creator
 */

export const loadUsers: ThunkActionCreator<Actions, RootState> =
  (page = 1) =>
  async dispatch => {
    dispatch(setLoading(true));

    try {
      const {data: users, meta} = await UserAPI.searchUsers(page);

      dispatch({
        type: constants.LOAD_USERS,
        payload: {
          users,
          meta,
        },
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

export const searchUsers: ThunkActionCreator<Actions, RootState> =
  (query: string) => async dispatch => {
    dispatch(setLoading(true));

    try {
      const {meta, data: users} = await UserAPI.searchUsers(query);

      console.log({meta, users});

      dispatch({
        type: constants.SET_SEARCHED_USERS,
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
