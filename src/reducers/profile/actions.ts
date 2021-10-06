import {Actions as BaseAction, setLoading, setError} from '../base/actions';
import {RootState} from '../index';
import * as constants from './constants';

import {Action} from 'redux';
import {Friend} from 'src/interfaces/friend';
import {SocialMedia} from 'src/interfaces/social';
import {User} from 'src/interfaces/user';
import * as FriendAPI from 'src/lib/api/friends';
import * as SocialAPI from 'src/lib/api/social';
import * as UserAPI from 'src/lib/api/user';
import {ThunkActionCreator} from 'src/types/thunk';

/**
 * Action Types
 */

export interface FetchProfileDetail extends Action {
  type: constants.FETCH_PROFILE_DETAIL;
  detail: User;
}

export interface FetchProfileFriend extends Action {
  type: constants.FETCH_PROFILE_FRIEND;
  friends: Friend[];
}

export interface FilterProfileFriend extends Action {
  type: constants.FILTER_PROFILE_FRIEND;
  friends: Friend[];
  query: string;
}

export interface FetchConnectedSocials extends Action {
  type: constants.FETCH_PROFILE_SOCIALS;
  payload: SocialMedia[];
}

/**
 * Union Action Types
 */

export type Actions =
  | FetchProfileDetail
  | FetchProfileFriend
  | FilterProfileFriend
  | FetchConnectedSocials
  | BaseAction;

/**
 *
 * Actions
 */
export const setProfile = (profle: User): FetchProfileDetail => ({
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
      const detail: User = await UserAPI.getUserDetail(userId);

      dispatch({
        type: constants.FETCH_PROFILE_DETAIL,
        detail,
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

export const fetchProfileFriend: ThunkActionCreator<Actions, RootState> =
  () => async (dispatch, getState) => {
    dispatch(setLoading(true));

    try {
      const {
        profileState: {detail},
      } = getState();

      if (!detail) {
        throw new Error('User not found');
      }

      const {data: friends} = await FriendAPI.getFriends(detail.id);

      dispatch({
        type: constants.FETCH_PROFILE_FRIEND,
        friends,
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

export const searchProfileFriend: ThunkActionCreator<Actions, RootState> =
  (userId: string, query: string) => async dispatch => {
    dispatch(setLoading(true));

    try {
      const {data: friends} = await FriendAPI.searchFriend(userId, query);
      dispatch({
        type: constants.FILTER_PROFILE_FRIEND,
        friends,
        query,
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

export const fetchConnectedSocials: ThunkActionCreator<Actions, RootState> =
  () => async (dispatch, getState) => {
    dispatch(setLoading(true));

    const {
      profileState: {detail},
    } = getState();

    if (!detail) return;

    try {
      const {data} = await SocialAPI.getUserSocials(detail.id);

      dispatch({
        type: constants.FETCH_PROFILE_SOCIALS,
        payload: data,
      });
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };
