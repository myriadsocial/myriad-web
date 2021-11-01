import * as ExperienceAPI from '../../lib/api/experience';
import {Actions as BaseAction, setLoading, setError, PaginationAction} from '../base/actions';
import {RootState} from '../index';
import * as constants from './constants';

import {Action} from 'redux';
import {ExperienceType} from 'src/components-v2/TimelineFilter/hooks/use-filter-option.hook';
import {UserExperience} from 'src/interfaces/experience';
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

export interface FetchProfileFriend extends PaginationAction {
  type: constants.FETCH_PROFILE_FRIEND;
  friends: Friend[];
}

export interface FilterProfileFriend extends PaginationAction {
  type: constants.FILTER_PROFILE_FRIEND;
  friends: Friend[];
  query: string;
}

export interface FetchConnectedSocials extends Action {
  type: constants.FETCH_PROFILE_SOCIALS;
  payload: SocialMedia[];
}

export interface FetchProfileExperience extends PaginationAction {
  type: constants.FETCH_PROFILE_EXPERIENCE;
  experiences: UserExperience[];
}

export interface SetProfileFriendedStatus extends Action {
  type: constants.SET_FRIENDED_STATUS;
  status: Friend;
}

/**
 * Union Action Types
 */

export type Actions =
  | FetchProfileDetail
  | FetchProfileFriend
  | FilterProfileFriend
  | FetchConnectedSocials
  | FetchProfileExperience
  | SetProfileFriendedStatus
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

      dispatch(setProfile(detail));
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

      const {data: friends, meta} = await FriendAPI.getFriends(detail.id);

      dispatch({
        type: constants.FETCH_PROFILE_FRIEND,
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

export const searchProfileFriend: ThunkActionCreator<Actions, RootState> =
  (userId: string, query: string) => async dispatch => {
    dispatch(setLoading(true));

    try {
      const {data: friends, meta} = await FriendAPI.searchFriend(userId, query);
      dispatch({
        type: constants.FILTER_PROFILE_FRIEND,
        friends,
        query,
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

export const fetchProfileExperience: ThunkActionCreator<Actions, RootState> =
  (type?: ExperienceType) => async (dispatch, getState) => {
    dispatch(setLoading(true));

    try {
      const {
        profileState: {detail},
      } = getState();

      if (!detail) {
        throw new Error('User not found');
      }

      const {meta, data: experiences} = await ExperienceAPI.getUserExperience(detail.id, type);

      dispatch({
        type: constants.FETCH_PROFILE_EXPERIENCE,
        experiences,
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

export const checkFriendedStatus: ThunkActionCreator<Actions, RootState> =
  () => async (dispatch, getState) => {
    dispatch(setLoading(true));

    try {
      const {
        profileState: {detail: profile},
        userState: {user},
      } = getState();

      if (!profile || !user) {
        throw new Error('User not found');
      }

      const {data} = await FriendAPI.checkFriendStatus(user.id, [profile.id]);

      if (data.length > 0) {
        dispatch({
          type: constants.SET_FRIENDED_STATUS,
          status: data[0],
        });
      }
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
