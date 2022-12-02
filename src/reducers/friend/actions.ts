import {Actions as BaseAction, PaginationAction, setLoading, setError} from '../base/actions';
import {RootState} from '../index';
import {FetchProfileDetail, setProfile} from '../profile/actions';
import * as constants from './constants';

import axios from 'axios';
import {Action} from 'redux';
import {Friend} from 'src/interfaces/friend';
import {User} from 'src/interfaces/user';
import * as FriendAPI from 'src/lib/api/friends';
import {PaginationParams} from 'src/lib/api/interfaces/pagination-params.interface';
import {ThunkActionCreator} from 'src/types/thunk';

/**
 * Action Types
 */

export interface LoadFriends extends PaginationAction {
  type: constants.FETCH_FRIEND;
  friends: Friend[];
}

export interface FilterFriend extends PaginationAction {
  type: constants.FILTER_FRIEND;
  friends: Friend[];
  filter: string;
}

export interface ClearFriend extends Action {
  type: constants.CLEAR_FRIEND;
}

export interface UpdateFriendsPagination extends Action {
  type: constants.SET_FRIENDS_FILTER;
  params: PaginationParams;
}

/**
 * Union Action Types
 */

export type Actions =
  | LoadFriends
  | FilterFriend
  | UpdateFriendsPagination
  | ClearFriend
  | BaseAction
  | FetchProfileDetail;

/**
 *
 * Actions
 */
export const updateFriendParams = (params: PaginationParams): UpdateFriendsPagination => ({
  type: constants.SET_FRIENDS_FILTER,
  params,
});

export const clearFriend = (): ClearFriend => ({
  type: constants.CLEAR_FRIEND,
});

/**
 * Action Creator
 */
export const fetchFriend: ThunkActionCreator<Actions, RootState> =
  (user?: User, page = 1) =>
  async (dispatch, getState) => {
    let currentUser = user;

    const {userState} = getState();

    if (!user) {
      currentUser = userState.user;
    }

    if (!currentUser) return;

    dispatch(setLoading(true));

    try {
      const {meta, data: friends} = await FriendAPI.getFriends(currentUser.id, {page});

      dispatch({
        type: constants.FETCH_FRIEND,
        friends,
        meta,
      });
    } catch (error) {
      dispatch(setError(error));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const searchFriend: ThunkActionCreator<Actions, RootState> =
  (query: string, page?: number) => async (dispatch, getState) => {
    dispatch(setLoading(true));

    const {
      userState: {user},
    } = getState();

    if (!user) return;

    try {
      const {meta, data: friends} = await FriendAPI.searchFriend({query, userId: user.id}, {page});

      dispatch({
        type: constants.FILTER_FRIEND,
        friends: friends,
        meta,
        filter: query,
      });
    } catch (error) {
      dispatch(setError(error));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const removeFromFriend: ThunkActionCreator<Actions, RootState> =
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

      dispatch(fetchFriend(user));
    } catch (error) {
      if (user && axios.isAxiosError(error) && error.response?.status === 401) {
        dispatch(fetchFriend(user));
      } else {
        dispatch(setError(error));
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

export const blockFromFriend: ThunkActionCreator<Actions, RootState> =
  (requesteeId: string) => async (dispatch, getState) => {
    dispatch(setLoading(true));

    const {
      userState: {user},
      profileState: {detail},
    } = getState();

    try {
      if (!user) {
        throw new Error('User not found');
      }

      const blocked = await FriendAPI.blockUser(requesteeId, user.id);

      dispatch(fetchFriend(user));

      if (detail) {
        dispatch(
          setProfile({
            ...detail,
            friendInfo: {
              id: blocked.id,
              status: blocked.status,
              requesteeId: blocked.requesteeId,
              requestorId: blocked.requestorId,
            },
          }),
        );
      }
    } catch (error) {
      if (user && axios.isAxiosError(error) && error.response?.status === 401) {
        dispatch(fetchFriend(user));
      } else {
        dispatch(setError(error));
      }
    } finally {
      dispatch(setLoading(false));
    }
  };
