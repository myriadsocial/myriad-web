import {Actions as BaseAction, setLoading, setError} from '../base/actions';
import {RootState} from '../index';
import * as constants from './constants';

import {Action} from 'redux';
import {Token} from 'src/interfaces/token';
import {ExtendedUser, User} from 'src/interfaces/user';
import * as TokenAPI from 'src/lib/api/token';
import * as UserAPI from 'src/lib/api/user';
import {ThunkActionCreator} from 'src/types/thunk';

/**
 * Action Types
 */

export interface SetUserAsAnonymous extends Action {
  type: constants.SET_USER_AS_ANONYMOUS;
  alias: string;
}

export interface FetchUser extends Action {
  type: constants.FETCH_USER;
  user: ExtendedUser;
}

export interface FetchUserToken extends Action {
  type: constants.FETCH_USER_TOKEN;
  payload: Token[];
}

export interface UpdateUser extends Action {
  type: constants.UPDATE_USER;
  user: ExtendedUser;
}

/**
 * Union Action Types
 */

export type Actions = FetchUser | FetchUserToken | SetUserAsAnonymous | UpdateUser | BaseAction;

/**
 *
 * Actions
 */
export const setUser = (user: ExtendedUser): FetchUser => ({
  type: constants.FETCH_USER,
  user,
});

export const setAnonymous = (alias: string): SetUserAsAnonymous => ({
  type: constants.SET_USER_AS_ANONYMOUS,
  alias,
});

/**
 * Action Creator
 */
export const fetchUser: ThunkActionCreator<Actions, RootState> =
  (userId: string) => async dispatch => {
    dispatch(setLoading(true));

    try {
      const user: ExtendedUser = await UserAPI.getUserDetail(userId);

      if (!user.userCredentials) {
        user.userCredentials = [];
      }

      dispatch(setUser(user));
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const fetchToken: ThunkActionCreator<Actions, RootState> =
  () => async (dispatch, getState) => {
    dispatch(setLoading(true));

    const {
      userState: {user},
    } = getState();

    if (!user) return;

    try {
      const tokens = await TokenAPI.getUserTokens({
        id: user.id,
      });

      dispatch({
        type: constants.FETCH_USER_TOKEN,
        payload: tokens,
      });
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const setUserAsAnonymous: ThunkActionCreator<Actions, RootState> =
  (alias: string) => async dispatch => {
    dispatch(setAnonymous(alias));
  };

export const updateUser: ThunkActionCreator<Actions, RootState> =
  (attributes: Partial<User>) => async (dispatch, getState) => {
    dispatch(setLoading(true));

    const {
      userState: {user},
    } = getState();

    if (!user) return;

    try {
      await UserAPI.updateUser(user.id, attributes);

      dispatch({
        type: constants.UPDATE_USER,
        user: {
          ...user,
          ...attributes,
        },
      });
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const deleteSocial: ThunkActionCreator<Actions, RootState> =
  (credentialId: string) => async (dispatch, getState) => {
    dispatch(setLoading(true));

    const {
      userState: {user},
    } = getState();

    if (!user) return;

    try {
      await UserAPI.disconnectSocial(credentialId);

      dispatch(fetchUser(user.id));
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };
