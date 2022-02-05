import {Actions as BaseAction, PaginationAction, setLoading, setError} from '../base/actions';
import {fetchFriend} from '../friend/actions';
import {RootState} from '../index';
import * as constants from './constants';

import axios from 'axios';
import {Action} from 'redux';
import {Friend, FriendStatus} from 'src/interfaces/friend';
import {User} from 'src/interfaces/user';
import * as FriendAPI from 'src/lib/api/friends';
import {ThunkActionCreator} from 'src/types/thunk';

/**
 * Action Types
 */

export interface LoadFriendRequests extends PaginationAction {
  type: constants.FETCH_FRIEND_REQUEST;
  requests: Friend[];
}
export interface CreateFriendRequest extends Action {
  type: constants.CREATE_FRIEND_REQUEST;
  request: Friend;
}

/**
 * Union Action Types
 */

export type Actions = LoadFriendRequests | CreateFriendRequest | BaseAction;

/**
 *
 * Actions
 */

/**
 * Action Creator
 */
export const fetchFriendRequest: ThunkActionCreator<Actions, RootState> =
  (user: User, page = 1) =>
  async (dispatch, getState) => {
    dispatch(setLoading(true));

    try {
      const {data: requests, meta} = await FriendAPI.getFriendRequests(user.id, page);

      dispatch({
        type: constants.FETCH_FRIEND_REQUEST,
        requests,
        meta,
      });
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const createFriendRequest: ThunkActionCreator<Actions, RootState> =
  (profile: User) => async (dispatch, getState) => {
    dispatch(setLoading(true));

    const {
      userState: {user},
    } = getState();

    try {
      if (!user) {
        throw new Error('User not found');
      }

      await FriendAPI.sendRequest(user.id, profile.id);

      dispatch(fetchFriendRequest(user));
    } catch (error) {
      // 422 means the other user already send friend request
      if (user && axios.isAxiosError(error) && error.response?.status === 422) {
        dispatch(fetchFriend(user));
      } else {
        dispatch(setError(error.message));
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

export const deleteFriendRequest: ThunkActionCreator<Actions, RootState> =
  (request: Friend) => async (dispatch, getState) => {
    dispatch(setLoading(true));

    const {
      userState: {user},
    } = getState();

    try {
      if (!user) {
        throw new Error('User not found');
      }

      await FriendAPI.deleteRequest(request.id);

      dispatch(fetchFriendRequest(user));
    } catch (error) {
      // 404 means the other user has already unfriended
      if (user && axios.isAxiosError(error) && error.response?.status === 404) {
        dispatch(fetchFriend(user));
      } else {
        dispatch(setError(error.message));
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

export const toggleFriendRequest: ThunkActionCreator<Actions, RootState> =
  (request: Friend, status: FriendStatus, callback?: () => void) => async (dispatch, getState) => {
    dispatch(setLoading(true));

    try {
      const {
        userState: {user},
      } = getState();

      if (!user) {
        throw new Error('User not found');
      }

      await FriendAPI.toggleRequest(request.id, status);

      if (status === FriendStatus.APPROVED) {
        dispatch(fetchFriend());
      }

      dispatch(fetchFriendRequest(user));

      callback && callback();
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };
