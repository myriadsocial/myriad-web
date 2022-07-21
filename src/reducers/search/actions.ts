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
  query?: string;
}

export interface SetFinishSearching extends Action {
  type: constants.SET_FINISH_SEARCHING;
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
  | SetFinishSearching
  | AbortSearch
  | UsersLoading
  | ClearUsers
  | BaseAction;

/**
 *
 * Actions
 */

export const setIsSearching = (query?: string): SetIsSearching => ({
  type: constants.SET_IS_SEARCHING,
  query,
});

export const setFinishSearching = (): SetFinishSearching => ({
  type: constants.SET_FINISH_SEARCHING,
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
    const {
      searchState: {
        query: storedQuery,
        meta: {currentPage},
      },
    } = getState();

    if (!query || !query.length) return;

    // skip if searching the same thing
    if (query === storedQuery && currentPage === page) return;

    dispatch(setUsersLoading(true));
    dispatch(setIsSearching(query));

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
      dispatch(setFinishSearching());
    }
  };
