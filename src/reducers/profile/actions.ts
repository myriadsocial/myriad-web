import * as ExperienceAPI from '../../lib/api/experience';
import {Actions as BaseAction, setLoading, setError, PaginationAction} from '../base/actions';
import {RootState} from '../index';
import * as constants from './constants';

import {Action} from 'redux';
import {UserExperience, ExperienceType} from 'src/interfaces/experience';
import {Friend} from 'src/interfaces/friend';
import {SocialMedia} from 'src/interfaces/social';
import {BlockedProps, User} from 'src/interfaces/user';
import * as FriendAPI from 'src/lib/api/friends';
import {PaginationParams} from 'src/lib/api/interfaces/pagination-params.interface';
import * as SocialAPI from 'src/lib/api/social';
import * as UserAPI from 'src/lib/api/user';
import {ThunkActionCreator} from 'src/types/thunk';

/**
 * Action Types
 */

export interface FetchProfileDetail extends Action {
  type: constants.FETCH_PROFILE_DETAIL;
  detail: User & BlockedProps;
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

export interface ClearProfileFriendedStatus extends Action {
  type: constants.CLEAR_FRIENDED_STATUS;
}

export interface UpdateProfileFriendsPagination extends Action {
  type: constants.SET_PROFILE_FRIENDS_FILTER;
  params: PaginationParams;
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
  | UpdateProfileFriendsPagination
  | ClearProfileFriendedStatus
  | BaseAction;

/**
 *
 * Actions
 */
export const setProfile = (profile: User & BlockedProps): FetchProfileDetail => ({
  type: constants.FETCH_PROFILE_DETAIL,
  detail: profile,
});

export const updateProfileFriendParams = (
  params: PaginationParams,
): UpdateProfileFriendsPagination => ({
  type: constants.SET_PROFILE_FRIENDS_FILTER,
  params,
});

/**
 * Action Creator
 */
export const fetchProfileDetail: ThunkActionCreator<Actions, RootState> =
  (userId: string) => async dispatch => {
    dispatch(setLoading(true));

    try {
      const detail: User & BlockedProps = await UserAPI.getUserDetail(userId);

      dispatch(setProfile(detail));
    } catch (error) {
      dispatch(setError(error));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const fetchProfileFriend: ThunkActionCreator<Actions, RootState> =
  (page = 1) =>
  async (dispatch, getState) => {
    dispatch(setLoading(true));

    const {
      profileState: {
        detail,
        friends: {params},
      },
    } = getState();

    if (!detail) return;

    try {
      const {data: friends, meta} = await FriendAPI.getFriends(detail.id, {...params, page});

      dispatch({
        type: constants.FETCH_PROFILE_FRIEND,
        friends,
        meta,
      });
    } catch (error) {
      dispatch(setError(error));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const searchProfileFriend: ThunkActionCreator<Actions, RootState> =
  (query: string, page = 1) =>
  async (dispatch, getState) => {
    dispatch(setLoading(true));

    const {
      profileState: {
        detail,
        friends: {params},
      },
    } = getState();

    if (!detail) return;

    try {
      const filter = {
        query,
        userId: detail.id,
      };

      const {data: friends, meta} = await FriendAPI.searchFriend(filter, {...params, page});

      dispatch({
        type: constants.FILTER_PROFILE_FRIEND,
        friends,
        query,
        meta,
      });
    } catch (error) {
      dispatch(setError(error));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const fetchProfileSocials: ThunkActionCreator<Actions, RootState> =
  (all = true) =>
  async (dispatch, getState) => {
    dispatch(setLoading(true));

    const {
      profileState: {detail},
    } = getState();

    if (!detail) return;

    try {
      const {data} = await SocialAPI.getUserSocials(detail.id, all);

      dispatch({
        type: constants.FETCH_PROFILE_SOCIALS,
        payload: data,
      });
    } catch (error) {
      dispatch(setError(error));
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

      const {meta, data: experiences} = await ExperienceAPI.getUserExperiences(detail.id, type);

      dispatch({
        type: constants.FETCH_PROFILE_EXPERIENCE,
        experiences,
        meta,
      });
    } catch (error) {
      dispatch(setError(error));
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
      } else {
        dispatch({
          type: constants.CLEAR_FRIENDED_STATUS,
        });
      }
    } catch (error) {
      dispatch(setError(error));
    } finally {
      dispatch(setLoading(false));
    }
  };
