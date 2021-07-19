import { Actions as BaseAction, setLoading, setError } from '../base/actions';
import { RootState } from '../index';
import * as constants from './constants';

import { ExtendedFriend } from 'src/interfaces/friend';
import * as FriendAPI from 'src/lib/api/friends';
import { ThunkActionCreator } from 'src/types/thunk';

/**
 * Action Types
 */

export interface LoadFriends {
  type: constants.FETCH_FRIEND;
  payload: ExtendedFriend[];
}

export interface LoadFriendRequests {
  type: constants.FETCH_FRIEND_REQUEST;
  payload: ExtendedFriend[];
}

/**
 * Union Action Types
 */

export type Actions = LoadFriends | LoadFriendRequests | BaseAction;

/**
 *
 * Actions
 */

/**
 * Action Creator
 */
export const fetchFriend: ThunkActionCreator<Actions, RootState> = () => async (dispatch, getState) => {
  dispatch(setLoading(true));

  try {
    const { userState } = getState();

    if (!userState.user) {
      throw new Error('User not found');
    }

    const requests: ExtendedFriend[] = await FriendAPI.getFriendRequests(userState.user.id);

    dispatch({
      type: constants.FETCH_FRIEND,
      payload: requests
    });
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};
