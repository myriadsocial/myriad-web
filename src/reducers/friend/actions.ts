import {Actions as BaseAction, setLoading, setError} from '../base/actions';
import {RootState} from '../index';
import * as constants from './constants';

import {Action} from 'redux';
import {generateImageSizes} from 'src/helpers/cloudinary';
import {ExtendedFriend, FriendStatus} from 'src/interfaces/friend';
import {User} from 'src/interfaces/user';
import * as FriendAPI from 'src/lib/api/friends';
import {ThunkActionCreator} from 'src/types/thunk';

/**
 * Action Types
 */

export interface LoadFriends extends Action {
  type: constants.FETCH_FRIEND;
  friends: ExtendedFriend[];
}

export interface LoadFriendRequests extends Action {
  type: constants.FETCH_FRIEND_REQUEST;
  requests: ExtendedFriend[];
}

export interface FilterFriend extends Action {
  type: constants.FILTER_FRIEND;
  friends: ExtendedFriend[];
  query: string;
}

export interface CreateFriendRequest extends Action {
  type: constants.CREATE_FRIEND_REQUEST;
  request: ExtendedFriend;
}

/**
 * Union Action Types
 */

export type Actions =
  | LoadFriends
  | LoadFriendRequests
  | FilterFriend
  | CreateFriendRequest
  | BaseAction;

/**
 *
 * Actions
 */

/**
 * Action Creator
 */
export const fetchFriend: ThunkActionCreator<Actions, RootState> =
  () => async (dispatch, getState) => {
    dispatch(setLoading(true));

    try {
      const {
        userState: {user},
      } = getState();

      if (!user) {
        throw new Error('User not found');
      }

      const friends: ExtendedFriend[] = await FriendAPI.getFriends(user.id);

      dispatch({
        type: constants.FETCH_FRIEND,
        friends: friends.map(friend => {
          if (friend.requestor && friend.requestor.profilePictureURL) {
            friend.requestor.profile_picture = {
              sizes: generateImageSizes(friend.requestor.profilePictureURL),
            };
          }

          if (friend.friend && friend.friend.profilePictureURL) {
            friend.friend.profile_picture = {
              sizes: generateImageSizes(friend.friend.profilePictureURL),
            };
          }

          return friend;
        }),
      });
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const fetchFriendRequest: ThunkActionCreator<Actions, RootState> =
  () => async (dispatch, getState) => {
    dispatch(setLoading(true));

    try {
      const {userState} = getState();

      if (!userState.user) {
        throw new Error('User not found');
      }

      const requests: ExtendedFriend[] = await FriendAPI.getFriendRequests(userState.user.id);

      dispatch({
        type: constants.FETCH_FRIEND_REQUEST,
        requests,
      });
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const searchFriend: ThunkActionCreator<Actions, RootState> =
  (query: string) => async (dispatch, getState) => {
    dispatch(setLoading(true));

    try {
      const {
        userState: {user},
      } = getState();

      if (!user) {
        throw new Error('User not found');
      }

      const friends: ExtendedFriend[] = await FriendAPI.searchFriend(user.id, query);

      dispatch({
        type: constants.FILTER_FRIEND,
        friends,
        query,
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

    try {
      const {
        userState: {user},
      } = getState();

      if (!user) {
        throw new Error('User not found');
      }

      await FriendAPI.sendRequest(user.id, profile.id);

      dispatch(fetchFriendRequest());
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const deleteFriendRequest: ThunkActionCreator<Actions, RootState> =
  (request: ExtendedFriend) => async (dispatch, getState) => {
    dispatch(setLoading(true));

    try {
      const {
        userState: {user},
      } = getState();

      if (!user) {
        throw new Error('User not found');
      }

      await FriendAPI.deleteRequest(request.id);

      dispatch(fetchFriendRequest());
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const toggleFriendRequest: ThunkActionCreator<Actions, RootState> =
  (request: ExtendedFriend, status: FriendStatus) => async (dispatch, getState) => {
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

      dispatch(fetchFriendRequest());
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };
