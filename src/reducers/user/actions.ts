import {Actions as BaseAction, setLoading, setError} from '../base/actions';
import {RootState} from '../index';
import * as constants from './constants';

import axios, {AxiosError} from 'axios';
import {Action} from 'redux';
import {generateImageSizes} from 'src/helpers/cloudinary';
import {SocialsEnum} from 'src/interfaces/index';
import {Token} from 'src/interfaces/token';
import {ExtendedUser, User, UserTransactionDetail} from 'src/interfaces/user';
import {WalletDetail, ContentType} from 'src/interfaces/wallet';
import * as TokenAPI from 'src/lib/api/token';
import * as UserAPI from 'src/lib/api/user';
import * as WalletAddressAPI from 'src/lib/api/wallet';
import {ThunkActionCreator} from 'src/types/thunk';

/**
 * Action Types
 */

export interface SetUserAsAnonymous extends Action {
  type: constants.SET_USER_AS_ANONYMOUS;
  alias: string;
}

export interface FetchUser extends Action {
  type: constants.FETCH_USER;
  user: ExtendedUser;
}

export interface FetchUserToken extends Action {
  type: constants.FETCH_USER_TOKEN;
  payload: Token[];
}

export interface FetchUserTransactionDetails extends Action {
  type: constants.FETCH_USER_TRANSACTION_DETAILS;
  payload: UserTransactionDetail[];
}

export interface UpdateUser extends Action {
  type: constants.UPDATE_USER;
  user: ExtendedUser;
}

export interface FetchRecipientDetail extends Action {
  type: constants.FETCH_RECIPIENT_DETAIL;
  payload: WalletDetail;
}

export interface SetRecipientDetail extends Action {
  type: constants.SET_RECIPIENT_DETAIL;
  recipientDetail: WalletDetail;
}

export interface SetVerifyingSocial extends Action {
  type: constants.SET_VERIFYING_SOCIAL_ACCOUNT;
}

export interface ResetVerifyingSocial extends Action {
  type: constants.RESET_VERIFYING_SOCIAL_ACCOUNT;
}

/**
 * Union Action Types
 */

export type Actions =
  | FetchUser
  | FetchUserToken
  | SetUserAsAnonymous
  | UpdateUser
  | FetchUserTransactionDetails
  | FetchRecipientDetail
  | SetRecipientDetail
  | SetVerifyingSocial
  | ResetVerifyingSocial
  | BaseAction;

/**
 *
 * Actions
 */
export const setUser = (user: ExtendedUser): FetchUser => ({
  type: constants.FETCH_USER,
  user,
});

export const setAnonymous = (alias: string): SetUserAsAnonymous => ({
  type: constants.SET_USER_AS_ANONYMOUS,
  alias,
});

export const setRecipientDetail = (recipientDetail: WalletDetail): SetRecipientDetail => ({
  type: constants.SET_RECIPIENT_DETAIL,
  recipientDetail,
});

export const setVerifyingSocial = (): SetVerifyingSocial => ({
  type: constants.SET_VERIFYING_SOCIAL_ACCOUNT,
});

export const resetVerifyingSocial = (): ResetVerifyingSocial => ({
  type: constants.RESET_VERIFYING_SOCIAL_ACCOUNT,
});

/**
 * Action Creator
 */
export const fetchUser: ThunkActionCreator<Actions, RootState> =
  (userId: string) => async dispatch => {
    dispatch(setLoading(true));

    try {
      const user: ExtendedUser = await UserAPI.getUserDetail(userId);

      if (!user.userCredentials) {
        user.userCredentials = [];
      }

      if (user.profilePictureURL) {
        user.profile_picture = {
          sizes: generateImageSizes(user.profilePictureURL),
        };
      }
      dispatch(setUser(user));
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const fetchToken: ThunkActionCreator<Actions, RootState> =
  () => async (dispatch, getState) => {
    dispatch(setLoading(true));

    const {
      userState: {user},
    } = getState();

    if (!user) return;

    try {
      const tokens = await TokenAPI.getUserTokens({
        id: user.id,
      });

      dispatch({
        type: constants.FETCH_USER_TOKEN,
        payload: tokens,
      });
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const fetchRecipientDetail: ThunkActionCreator<Actions, RootState> =
  (postId: string) => async dispatch => {
    dispatch(setLoading(true));

    try {
      const {walletAddress} = await WalletAddressAPI.getWalletAddress(postId);

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

export const verifySocialMediaConnected: ThunkActionCreator<Actions, RootState> =
  (platform: SocialsEnum, socialName: string, callback?: () => void) =>
  async (dispatch, getState) => {
    const {
      userState: {user},
    } = getState();

    if (!user) return;

    dispatch(setVerifyingSocial());

    try {
      await UserAPI.verifySocialAccount(socialName, platform, user.id);

      dispatch(fetchUser(user.id));

      callback && callback();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        dispatch(handleVerifyError(error));
      } else {
        dispatch(setError(error.message));
      }
    }
  };

export const handleVerifyError: ThunkActionCreator<Actions, RootState> =
  (error: AxiosError) => async dispatch => {
    if (error.response) {
      switch (error.response.status) {
        case 404:
          switch (error.response.data.error.name) {
            case 'Error':
              dispatch(setError('Please enter the correct account address'));
              break;
            default:
              switch (error.response.data.error.message) {
                case 'This twitter/facebook/reddit does not belong to you!':
                  dispatch(setError('Sorry, this account has been claimed by somebody else'));
                  break;
                case 'Credential Invalid':
                  dispatch(setError('Invalid credentials'));
                  break;
                default:
                  dispatch(setError(error.response.data.error.message));
                  break;
              }
              break;
          }
          break;

        case 400:
        default:
          dispatch(setError('Please enter the correct account address'));
          break;
      }
    }
  };

// TODO: move this to transaction reducer
export const fetchUserTransactionDetails: ThunkActionCreator<Actions, RootState> =
  () => async (dispatch, getState) => {
    dispatch(setLoading(true));

    const {
      userState: {user},
    } = getState();

    if (!user) return;

    try {
      const transactionDetails = await UserAPI.getUserTransactionDetails(user.id);

      dispatch({
        type: constants.FETCH_USER_TRANSACTION_DETAILS,
        payload: transactionDetails,
      });
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const setUserAsAnonymous: ThunkActionCreator<Actions, RootState> =
  (alias: string) => async dispatch => {
    dispatch(setAnonymous(alias));
  };

export const updateUser: ThunkActionCreator<Actions, RootState> =
  (attributes: Partial<User>) => async (dispatch, getState) => {
    dispatch(setLoading(true));

    const {
      userState: {user},
    } = getState();

    if (!user) return;

    try {
      await UserAPI.updateUser(user.id, attributes);

      dispatch({
        type: constants.UPDATE_USER,
        user: {
          ...user,
          ...attributes,
        },
      });
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const deleteSocial: ThunkActionCreator<Actions, RootState> =
  (credentialId: string) => async (dispatch, getState) => {
    dispatch(setLoading(true));

    const {
      userState: {user},
    } = getState();

    if (!user) return;

    try {
      await UserAPI.disconnectSocial(credentialId);

      dispatch(fetchUser(user.id));
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };
