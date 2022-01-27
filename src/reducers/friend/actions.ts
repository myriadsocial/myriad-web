import {Actions as BaseAction, PaginationAction, setLoading, setError} from '../base/actions';
import {RootState} from '../index';
import * as constants from './constants';

import {Friend} from 'src/interfaces/friend';
import {User} from 'src/interfaces/user';
import * as FriendAPI from 'src/lib/api/friends';
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

/**
 * Union Action Types
 */

export type Actions = LoadFriends | FilterFriend | BaseAction;

/**
 *
 * Actions
 */

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
      const {meta, data: friends} = await FriendAPI.getFriends(currentUser.id, page);

      dispatch({
        type: constants.FETCH_FRIEND,
        friends,
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

export const searchFriend: ThunkActionCreator<Actions, RootState> =
  (user: User, query: string) => async (dispatch, getState) => {
    dispatch(setLoading(true));

    try {
      const {meta, data: friends} = await FriendAPI.searchFriend(user.id, query);

      dispatch({
        type: constants.FILTER_FRIEND,
        friends,
        meta,
        filter: query,
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

export const removedFriendList: ThunkActionCreator<Actions, RootState> =
  (request: Friend) => async (dispatch, getState) => {
    dispatch(setLoading(true));

    try {
      const {
        userState: {user},
      } = getState();

      if (!user) {
        throw new Error('User not found');
      }
      await FriendAPI.deleteRequest(request.id);

      dispatch(fetchFriend(user));
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const blockedFriendList: ThunkActionCreator<Actions, RootState> =
  (requesteeId: string) => async (dispatch, getState) => {
    dispatch(setLoading(true));

    try {
      const {
        userState: {user},
      } = getState();

      if (!user) {
        throw new Error('User not found');
      }
      await FriendAPI.blockedUser(requesteeId, user.id);

      dispatch(fetchFriend(user));
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };
