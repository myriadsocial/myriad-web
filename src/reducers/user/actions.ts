import {Status} from '../../interfaces/toaster';
import {Actions as BaseAction, setLoading, setError} from '../base/actions';
import {RootState} from '../index';
import {ShowToaster, showToaster} from '../toaster/actions';
import * as constants from './constants';

import axios, {AxiosError} from 'axios';
import {Action} from 'redux';
import {Currency, CurrencyId} from 'src/interfaces/currency';
import {SocialsEnum} from 'src/interfaces/index';
import {SocialMedia} from 'src/interfaces/social';
import {User, UserTransactionDetail, Report} from 'src/interfaces/user';
import {BaseErrorResponse} from 'src/lib/api/interfaces/error-response.interface';
import * as SocialAPI from 'src/lib/api/social';
import * as TokenAPI from 'src/lib/api/token';
import * as UserAPI from 'src/lib/api/user';
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
  user: User;
}

export interface AddUserToken extends Action {
  type: constants.ADD_USER_TOKEN;
  payload: Currency;
}

export interface SetDefaultCurrency extends Action {
  type: constants.SET_DEFAULT_CURRENCY;
  user: User;
}

export interface FetchConnectedSocials extends Action {
  type: constants.FETCH_USER_SOCIALS;
  payload: SocialMedia[];
}

export interface FetchUserTransactionDetail extends Action {
  type: constants.FETCH_USER_TRANSACTION_DETAIL;
  payload: UserTransactionDetail;
}

export interface UpdateUser extends Action {
  type: constants.UPDATE_USER;
  user: User;
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
  | FetchConnectedSocials
  | AddUserToken
  | SetDefaultCurrency
  | SetUserAsAnonymous
  | UpdateUser
  | FetchUserTransactionDetail
  | SetVerifyingSocial
  | ResetVerifyingSocial
  | ShowToaster
  | BaseAction;

/**
 *
 * Actions
 */
export const setUser = (user: User): FetchUser => ({
  type: constants.FETCH_USER,
  user,
});

export const setAnonymous = (alias: string): SetUserAsAnonymous => ({
  type: constants.SET_USER_AS_ANONYMOUS,
  alias,
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
      const user: User = await UserAPI.getUserDetail(userId);

      dispatch(setUser(user));
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
      userState: {user},
    } = getState();

    if (!user) return;

    try {
      const {data} = await SocialAPI.getUserSocials(user.id);

      dispatch({
        type: constants.FETCH_USER_SOCIALS,
        payload: data,
      });
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
      await SocialAPI.verifySocialAccount(socialName, platform, user.id);

      dispatch(fetchConnectedSocials());

      dispatch(resetVerifyingSocial());

      callback && callback();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        dispatch(handleVerifyError(error));
      } else {
        dispatch(
          setError({
            message: error.message,
          }),
        );
      }

      dispatch(resetVerifyingSocial());
    }
  };

// TODO: handle this on social API
export const handleVerifyError: ThunkActionCreator<Actions, RootState> =
  (error: AxiosError<BaseErrorResponse>) => async dispatch => {
    if (error.response) {
      dispatch(
        setError({
          message: error.response.data.error.message,
        }),
      );
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
      const transactionDetail = await UserAPI.getUserTransactionDetail(user.id);

      dispatch({
        type: constants.FETCH_USER_TRANSACTION_DETAIL,
        payload: transactionDetail,
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

export const setUserAsAnonymous: ThunkActionCreator<Actions, RootState> =
  (alias: string) => async dispatch => {
    dispatch(setAnonymous(alias));
  };

export const setDefaultCurrency: ThunkActionCreator<Actions, RootState> =
  (currencyId: CurrencyId) => async (dispatch, getState) => {
    dispatch(setLoading(true));
    const {
      userState: {user},
    } = getState();

    if (!user) return;

    dispatch({
      type: constants.SET_DEFAULT_CURRENCY,
      user: {
        ...user,
        defaultCurrency: currencyId,
      },
    });

    dispatch(setLoading(false));
  };

export const updateUser: ThunkActionCreator<Actions, RootState> =
  (attributes: Partial<User>, callback?: () => void) => async (dispatch, getState) => {
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
      dispatch(
        showToaster({
          message: 'Success update profile',
          toasterStatus: Status.SUCCESS,
        }),
      );
    } catch (error) {
      dispatch(
        setError({
          message: error.message,
        }),
      );
    } finally {
      dispatch(setLoading(false));

      callback && callback();
    }
  };

export const reportUser: ThunkActionCreator<Actions, RootState> =
  (payload: Partial<Report>) => async (dispatch, getState) => {
    dispatch(setLoading(true));
    try {
      await UserAPI.reportUser(payload);
      dispatch(
        showToaster({
          message: 'Success report this user',
          toasterStatus: Status.SUCCESS,
        }),
      );
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

export const deleteSocial: ThunkActionCreator<Actions, RootState> =
  (credentialId: string) => async (dispatch, getState) => {
    dispatch(setLoading(true));

    const {
      userState: {user},
    } = getState();

    if (!user) return;

    try {
      await SocialAPI.disconnectSocial(credentialId);

      dispatch(fetchConnectedSocials());
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

export const addUserCurrency: ThunkActionCreator<Actions, RootState> =
  (selectedCurrency: Currency, callback?: () => void) => async (dispatch, getState) => {
    dispatch(setLoading(true));
    const {
      userState: {user},
    } = getState();

    if (!user) return;

    try {
      await TokenAPI.addUserToken({
        currencyId: selectedCurrency.id,
        userId: user.id,
      });

      dispatch({
        type: constants.ADD_USER_TOKEN,
        payload: selectedCurrency,
      });

      dispatch(
        showToaster({
          toasterStatus: Status.SUCCESS,
          message: 'Added successfully, please refresh browser!',
        }),
      );

      callback && callback();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 422) {
        dispatch(
          showToaster({
            message: 'Token already added to your wallet!',
            toasterStatus: Status.DANGER,
          }),
        );

        dispatch(
          setError({
            message: 'Token is already on your wallet!',
          }),
        );
      } else {
        dispatch(setError(error.message));
      }
    } finally {
      dispatch(setLoading(false));
    }
  };
