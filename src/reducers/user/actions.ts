import {encodeAddress} from '@polkadot/keyring';
import {hexToU8a} from '@polkadot/util';

import {sortBalances} from '../balance/actions';
import {Actions as BaseAction, setLoading, setError, PaginationAction} from '../base/actions';
import {RootState} from '../index';
import {ShowToasterSnack, showToasterSnack} from '../toaster-snack/actions';
import * as constants from './constants';

import axios, {AxiosError} from 'axios';
import {Action} from 'redux';
import {Currency, CurrencyId} from 'src/interfaces/currency';
import {WrappedExperience} from 'src/interfaces/experience';
import {SocialsEnum} from 'src/interfaces/index';
import {SocialMedia} from 'src/interfaces/social';
import {User, UserTransactionDetail, UserWallet} from 'src/interfaces/user';
import {Network} from 'src/interfaces/wallet';
import * as ExperienceAPI from 'src/lib/api/experience';
import {BaseErrorResponse} from 'src/lib/api/interfaces/error-response.interface';
import * as SocialAPI from 'src/lib/api/social';
import * as TokenAPI from 'src/lib/api/token';
import * as UserAPI from 'src/lib/api/user';
import * as WalletAPI from 'src/lib/api/wallet';
import {getMetadata} from 'src/lib/services/polkadot-js';
import {ThunkActionCreator} from 'src/types/thunk';

/**
 * Action Types
 */

export interface SetUserAsAnonymous extends Action {
  type: constants.SET_USER_AS_ANONYMOUS;
  alias: string;
}

export interface ClearUser extends Action {
  type: constants.CLEAR_USER;
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

export interface FetchUserExperience extends PaginationAction {
  type: constants.FETCH_USER_EXPERIENCE;
  experiences: WrappedExperience[];
}

export interface FetchCurrentUserWallet extends Action {
  type: constants.FETCH_CURRENT_USER_WALLETS;
  payload: UserWallet;
}

export interface FetchNetwork extends PaginationAction {
  type: constants.FETCH_NETWORK;
  payload: Network[];
}

export interface FetchUserWalletAddress extends Action {
  type: constants.FETCH_USER_WALLET_ADDRESS;
  payload: string | null;
}

export interface AddUserWallet extends Action {
  type: constants.ADD_USER_WALLET;
  payload: UserWallet;
}

export interface FetchUserWallets extends PaginationAction {
  type: constants.FETCH_USER_WALLETS;
  payload: UserWallet[];
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
  | FetchUserExperience
  | FetchCurrentUserWallet
  | AddUserWallet
  | FetchUserWallets
  | FetchNetwork
  | FetchUserWalletAddress
  | AddUserToken
  | SetDefaultCurrency
  | SetUserAsAnonymous
  | UpdateUser
  | ClearUser
  | FetchUserTransactionDetail
  | SetVerifyingSocial
  | ResetVerifyingSocial
  | ShowToasterSnack
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

export const clearUser = (): ClearUser => ({
  type: constants.CLEAR_USER,
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
  (address: string) => async dispatch => {
    dispatch(setLoading(true));

    let user: User | null = null;

    try {
      user = await WalletAPI.getUserByWalletAddress(address);

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

    return user;
  };

export const fetchConnectedSocials: ThunkActionCreator<Actions, RootState> =
  () => async (dispatch, getState) => {
    dispatch(setLoading(true));

    const {
      userState: {user},
    } = getState();

    if (!user) return;

    try {
      const allSocials = true;

      const {data} = await SocialAPI.getUserSocials(user.id, allSocials);

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

export const fetchUserExperience: ThunkActionCreator<Actions, RootState> =
  () => async (dispatch, getState) => {
    dispatch(setLoading(true));

    const {
      userState: {user, anonymous},
    } = getState();

    try {
      if (anonymous) {
        const {data: experiences, meta} = await ExperienceAPI.getExperiences({limit: 3});
        dispatch({
          type: constants.FETCH_USER_EXPERIENCE,
          experiences: experiences.map(item => ({
            subscribed: false,
            experience: item,
          })),
          meta,
        });
      }

      if (user) {
        const {meta, data: experiences} = await ExperienceAPI.getUserExperiences(user.id);

        dispatch({
          type: constants.FETCH_USER_EXPERIENCE,
          experiences: experiences,
          meta,
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

export const fetchUserWalletAddress: ThunkActionCreator<Actions, RootState> =
  () => async (dispatch, getState) => {
    dispatch(setLoading(true));

    const {
      userState: {currentWallet},
    } = getState();

    if (currentWallet === undefined) return;

    if (currentWallet.network === undefined) return;

    try {
      const data = await getMetadata(currentWallet.network.rpcURL);

      let walletAddress = '';

      if (data !== null) {
        walletAddress = encodeAddress(hexToU8a(currentWallet.id), data);
        dispatch({
          type: constants.FETCH_USER_WALLET_ADDRESS,
          payload: walletAddress,
        });
      }
    } catch (error) {
      console.log({error});
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const fetchCurrentUserWallets: ThunkActionCreator<Actions, RootState> =
  () => async (dispatch, getState) => {
    dispatch(setLoading(true));

    const {
      userState: {user},
    } = getState();

    if (!user) return;

    try {
      const data = await WalletAPI.getCurrentUserWallet();

      dispatch({
        type: constants.FETCH_CURRENT_USER_WALLETS,
        payload: data,
      });
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const fetchUserWallets: ThunkActionCreator<Actions, RootState> =
  () => async (dispatch, getState) => {
    dispatch(setLoading(true));

    const {
      userState: {user},
    } = getState();

    if (!user) return;

    try {
      const {data: wallets, meta} = await WalletAPI.getUserWallets(user.id);

      dispatch({
        type: constants.FETCH_USER_WALLETS,
        payload: wallets,
        meta,
      });
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const addNewWallet: ThunkActionCreator<Actions, RootState> =
  (newWallet: UserWallet) => async dispatch => {
    dispatch({
      type: constants.ADD_USER_WALLET,
      payload: newWallet,
    });
  };

export const verifySocialMediaConnected: ThunkActionCreator<Actions, RootState> =
  (platform: SocialsEnum, socialName: string, address: string, callback?: () => void) =>
  async (dispatch, getState) => {
    const {
      userState: {user},
    } = getState();

    if (!user) return;

    dispatch(setVerifyingSocial());

    try {
      await SocialAPI.verifySocialAccount(socialName, platform, address);

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

    dispatch(sortBalances(currencyId));
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

      callback && callback();
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

export const setAsPrimary: ThunkActionCreator<Actions, RootState> =
  (credentialId: string) => async (dispatch, getState) => {
    dispatch(setLoading(true));

    const {
      userState: {user},
    } = getState();

    if (!user) return;

    try {
      await SocialAPI.updateSocialAsPrimary(credentialId);

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
        showToasterSnack({
          message: 'Added successfully, please refresh browser!',
          variant: 'success',
        }),
      );

      callback && callback();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 422) {
        dispatch(
          showToasterSnack({
            message: 'Token already added to your wallet!',
            variant: 'error',
          }),
        );
      } else {
        dispatch(setError(error.message));
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

export const fetchNetwork: ThunkActionCreator<Actions, RootState> =
  () => async (dispatch, getState) => {
    dispatch(setLoading(true));

    const {
      userState: {user},
    } = getState();

    if (!user) return;

    try {
      const {data: networks, meta} = await WalletAPI.getNetworks();

      dispatch({
        type: constants.FETCH_NETWORK,
        payload: networks.map(network => {
          network.tips = [];
          return network;
        }),
        meta,
      });
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };
