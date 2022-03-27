import {Actions as BaseAction, setError} from '../base/actions';
import {RootState} from '../index';
import * as constants from './constants';

import {Action} from 'redux';
import {User} from 'src/interfaces/user';
import {ListMeta} from 'src/lib/api/interfaces/base-list.interface';
import * as UserAPI from 'src/lib/api/user';
import {ThunkActionCreator} from 'src/types/thunk';

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

export interface SearchUsers extends Action {
  type: constants.SEARCH_USERS;
  payload: {
    users: User[];
    meta: ListMeta;
  };
}

export interface SetIsSearching extends Action {
  type: constants.SET_IS_SEARCHING;
  isSearching: boolean;
}

export interface AbortSearch extends Action {
  type: constants.ABORT_SEARCH;
}

export interface UsersLoading extends Action {
  type: constants.USERS_LOADING;
  loading: boolean;
}

export interface ClearUsers extends Action {
  type: constants.CLEAR_USERS;
}

/**
 * Union Action Types
 */
export type Actions =
  | ResetState
  | LoadUsers
  | SearchUsers
  | SetIsSearching
  | AbortSearch
  | UsersLoading
  | ClearUsers
  | BaseAction;

/**
 *
 * Actions
 */

export const setIsSearching = (isSearching: boolean): SetIsSearching => ({
  type: constants.SET_IS_SEARCHING,
  isSearching,
});

export const setUsersLoading = (loading: boolean): UsersLoading => ({
  type: constants.USERS_LOADING,
  loading,
});

export const clearUsers = (): ClearUsers => ({
  type: constants.CLEAR_USERS,
});

/**
 * Action Creator
 */

export const loadUsers: ThunkActionCreator<Actions, RootState> =
  (page = 1) =>
  async dispatch => {
    dispatch(setUsersLoading(true));

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
      dispatch(setError(error));
    } finally {
      dispatch(setUsersLoading(false));
    }
  };

export const searchUsers: ThunkActionCreator<Actions, RootState> =
  (query: string, page = 1) =>
  async (dispatch, getState) => {
    dispatch(setUsersLoading(true));
    dispatch(setIsSearching(true));

    try {
      const {meta, data: users} = await UserAPI.searchUsers(page, query);

      dispatch({
        type: constants.SEARCH_USERS,
        payload: {
          users,
          meta,
        },
      });
    } catch (error) {
      dispatch(setError(error));
    } finally {
      dispatch(setUsersLoading(false));
      dispatch(setIsSearching(false));
    }
  };
