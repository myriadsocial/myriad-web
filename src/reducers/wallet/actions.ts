import {Actions as BaseAction, setLoading, setError} from '../base/actions';
import {RootState} from '../index';
import * as constants from './constants';

import {Action} from 'redux';
import {WalletDetail, ContentType} from 'src/interfaces/wallet';
import * as PostAPI from 'src/lib/api/post';
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

/**
 * Union Action Types
 */

export type Actions = FetchRecipientDetail | SetRecipientDetail | BaseAction;

/**
 *
 * Actions
 */

export const setRecipientDetail = (recipientDetail: WalletDetail): SetRecipientDetail => ({
  type: constants.SET_RECIPIENT_DETAIL,
  recipientDetail,
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
        postId,
        contentType: ContentType.POST,
      };

      dispatch(setRecipientDetail(walletDetailPayload));
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };
