import {Actions as BaseAction, setLoading, setError} from '../base/actions';
import {RootState} from '../index';
import * as constants from './constants';

import {Action} from 'redux';
import {User} from 'src/interfaces/user';
import {WalletDetail, ContentType} from 'src/interfaces/wallet';
import * as PostAPI from 'src/lib/api/post';
import * as UserAPI from 'src/lib/api/user';
import {ThunkActionCreator} from 'src/types/thunk';

/**
 * Action Types
 */

export interface FetchRecipientDetail extends Action {
  type: constants.FETCH_RECIPIENT_DETAIL;
  payload: WalletDetail;
}

export interface SetRecipientDetail extends Action {
  type: constants.SET_RECIPIENT_DETAIL;
  recipientDetail: WalletDetail;
}

export interface SetTippedUserId extends Action {
  type: constants.SET_TIPPED_USER_ID;
  tippedUserId: string;
}

export interface SetTippedUser extends Action {
  type: constants.SET_TIPPED_USER;
  tippedUser: User;
}

/**
 * Union Action Types
 */

export type Actions =
  | FetchRecipientDetail
  | SetRecipientDetail
  | SetTippedUserId
  | SetTippedUser
  | BaseAction;

/**
 *
 * Actions
 */

export const setRecipientDetail = (recipientDetail: WalletDetail): SetRecipientDetail => ({
  type: constants.SET_RECIPIENT_DETAIL,
  recipientDetail,
});

export const setTippedUserId = (tippedUserId: string): SetTippedUserId => ({
  type: constants.SET_TIPPED_USER_ID,
  tippedUserId,
});

export const setTippedUser = (tippedUser: User): SetTippedUser => ({
  type: constants.SET_TIPPED_USER,
  tippedUser,
});

/**
 * Action Creator
 */

export const fetchRecipientDetail: ThunkActionCreator<Actions, RootState> =
  (postId: string) => async dispatch => {
    dispatch(setLoading(true));

    try {
      const {walletAddress} = await PostAPI.getWalletAddress(postId);

      const walletDetailPayload = {
        walletAddress,
        referenceId: postId,
        contentType: ContentType.POST,
      };

      dispatch(setRecipientDetail(walletDetailPayload));
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

export const fetchTippedUserId: ThunkActionCreator<Actions, RootState> =
  (postId: string) => async (dispatch, getState) => {
    const {
      timelineState: {posts},
    } = getState();

    dispatch(setLoading(true));

    try {
      const {walletAddress} = await PostAPI.getWalletAddress(postId);

      const {people} = posts.filter(post => post.id === postId).shift();

      if (!people) {
        const user = await UserAPI.getUserDetail(walletAddress);
        dispatch(setTippedUser(user));
      } else {
        dispatch(setTippedUser(people));
      }

      dispatch(setTippedUserId(walletAddress));
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
