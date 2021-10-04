import {Actions as BaseAction, setLoading, setError} from '../base/actions';
import {RootState} from '../index';
import * as constants from './constants';

import axios, {AxiosError} from 'axios';
import {Action} from 'redux';
import {Currency, CurrencyId} from 'src/interfaces/currency';
import {SocialsEnum} from 'src/interfaces/index';
import {SocialMedia} from 'src/interfaces/social';
import {User, UserTransactionDetail} from 'src/interfaces/user';
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
  payload: CurrencyId;
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
  (error: AxiosError) => async dispatch => {
    if (error.response) {
      switch (error.response.status) {
        case 404:
          switch (error.response.data.error.name) {
            case 'Error':
              dispatch(
                setError({
                  message: 'Please enter the correct account address',
                }),
              );

              break;
            default:
              switch (error.response.data.error.message) {
                case 'This twitter/facebook/reddit does not belong to you!':
                  dispatch(
                    setError({
                      message: 'Sorry, this account has been claimed by somebody else',
                    }),
                  );
                  break;
                case 'Credential Invalid':
                  dispatch(
                    setError({
                      message: 'Invalid credentials',
                    }),
                  );

                  break;
                default:
                  dispatch(
                    setError({
                      message: error.response.data.error.message,
                    }),
                  );
                  break;
              }
              break;
          }
          break;

        case 400:
        default:
          dispatch(
            setError({
              message: 'Please enter the correct account address',
            }),
          );
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
  (currencyId: string, callback?: () => void) => async (dispatch, getState) => {
    dispatch(setLoading(true));
    const {
      userState: {user},
    } = getState();

    if (!user) return;

    try {
      const data = await TokenAPI.addUserToken({
        currencyId,
        userId: user.id,
      });

      dispatch({
        type: constants.ADD_USER_TOKEN,
        payload: data,
      });

      callback && callback();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 422) {
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

export const setDefaultCurrency: ThunkActionCreator<Actions, RootState> =
  (currencyId: CurrencyId, callback?: () => void) => async (dispatch, getState) => {
    dispatch(setLoading(true));
    const {
      userState: {user},
    } = getState();

    if (!user) return;

    try {
      console.log({currencyId});

      const data = await TokenAPI.changeDefaultCurrency({
        currencyId,
        userId: user.id,
      });

      console.log({data});

      if (data) {
        dispatch({
          type: constants.SET_DEFAULT_CURRENCY,
          payload: currencyId,
        });
      } else {
        throw {
          message: 'Something wrong happened!',
        };
      }

      callback && callback();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status !== 204) {
        dispatch(
          setError({
            message: 'Oops, please try again later!',
          }),
        );
      } else {
        dispatch(setError(error.message));
      }
    } finally {
      dispatch(setLoading(false));
    }
  };
