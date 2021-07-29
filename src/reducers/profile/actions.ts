import {Actions as BaseAction, setLoading, setError} from '../base/actions';
import {RootState} from '../index';
import * as constants from './constants';

import {Action} from 'redux';
import {ExtendedFriend} from 'src/interfaces/friend';
import {ExtendedUser} from 'src/interfaces/user';
import * as FriendAPI from 'src/lib/api/friends';
import * as UserAPI from 'src/lib/api/user';
import {ThunkActionCreator} from 'src/types/thunk';

/**
 * Action Types
 */

export interface FetchProfileDetail extends Action {
  type: constants.FETCH_PROFILE_DETAIL;
  detail: ExtendedUser;
}

export interface FetchProfileFriend extends Action {
  type: constants.FETCH_PROFILE_FRIEND;
  friends: ExtendedFriend[];
}

export interface FilterProfileFriend extends Action {
  type: constants.FILTER_PROFILE_FRIEND;
  friends: ExtendedFriend[];
  query: string;
}

/**
 * Union Action Types
 */

export type Actions = FetchProfileDetail | FetchProfileFriend | FilterProfileFriend | BaseAction;

/**
 *
 * Actions
 */
export const setProfile = (profle: ExtendedUser): FetchProfileDetail => ({
  type: constants.FETCH_PROFILE_DETAIL,
  detail: profle,
});

/**
 * Action Creator
 */
export const fetchProfileDetail: ThunkActionCreator<Actions, RootState> =
  (userId: string) => async dispatch => {
    dispatch(setLoading(true));

    try {
      const detail: ExtendedUser = await UserAPI.getUserDetail(userId);

      dispatch({
        type: constants.FETCH_PROFILE_DETAIL,
        detail,
      });
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const fetchProfileFriend: ThunkActionCreator<Actions, RootState> =
  (userId: string) => async dispatch => {
    dispatch(setLoading(true));

    try {
      const friends: ExtendedFriend[] = await FriendAPI.getFriends(userId);

      dispatch({
        type: constants.FETCH_PROFILE_FRIEND,
        friends,
      });
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const searchProfileFriend: ThunkActionCreator<Actions, RootState> =
  (userId: string, query: string) => async dispatch => {
    dispatch(setLoading(true));

    try {
      const friends: ExtendedFriend[] = await FriendAPI.searchFriend(userId, query);
      dispatch({
        type: constants.FILTER_PROFILE_FRIEND,
        friends,
        query,
      });
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };
