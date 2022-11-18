import {encodeAddress} from '@polkadot/keyring';
import {hexToU8a} from '@polkadot/util';

import {sortBalances} from '../balance/actions';
import {Actions as BaseAction, setLoading, setError, PaginationAction} from '../base/actions';
import {RootState} from '../index';
import * as constants from './constants';

import axios from 'axios';
import {Action} from 'redux';
import {BalanceDetail} from 'src/interfaces/balance';
import {IProvider} from 'src/interfaces/blockchain-interface';
import {Currency} from 'src/interfaces/currency';
import {WrappedExperience} from 'src/interfaces/experience';
import {SocialsEnum} from 'src/interfaces/index';
import {NetworkIdEnum, Network} from 'src/interfaces/network';
import {SocialMedia} from 'src/interfaces/social';
import {User, UserTransactionDetail, UserWallet} from 'src/interfaces/user';
import * as ExperienceAPI from 'src/lib/api/experience';
import * as SocialAPI from 'src/lib/api/social';
import * as TokenAPI from 'src/lib/api/token';
import * as UserAPI from 'src/lib/api/user';
import * as WalletAPI from 'src/lib/api/wallet';
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

export interface SetFullAccess extends Action {
  type: constants.SET_FULLACCESS;
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
  | SetFullAccess
  | BaseAction;

/**
 *
 * Actions
 */
export const setUser = (user: User): FetchUser => ({
  type: constants.FETCH_USER,
  user,
});

export const setFullAccess = (): SetFullAccess => ({
  type: constants.SET_FULLACCESS,
});

export const setCurrentUserWallet = (user: User): FetchCurrentUserWallet => {
  const wallet = user.wallets[0];
  const network = wallet.network;
  const userWallet: UserWallet = {
    ...wallet,
    user,
    network,
  };

  return {
    type: constants.FETCH_CURRENT_USER_WALLETS,
    payload: userWallet,
  };
};

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
export const fetchUser: ThunkActionCreator<Actions, RootState> = () => async dispatch => {
  dispatch(setLoading(true));

  let user: User | null = null;

  try {
    user = await WalletAPI.getUser();

    //Define empty arrays for users without wallets and currencies (login with email only)
    if (!user.wallets) {
      user.wallets = [];
    }
    if (!user.currencies) {
      user.currencies = [];
    }

    if (user.wallets.length > 0 && user.currencies.length > 0) {
      dispatch(setCurrentUserWallet(user));
    }

    dispatch(setUser(user));
  } catch (error) {
    dispatch(setError(error));
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
      dispatch(setError(error));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const fetchUserExperience: ThunkActionCreator<Actions, RootState> =
  (page = 1) =>
  async (dispatch, getState) => {
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
        const {meta, data: experiences} = await ExperienceAPI.getUserExperiences(
          user.id,
          undefined,
          page,
        );

        dispatch({
          type: constants.FETCH_USER_EXPERIENCE,
          experiences: experiences,
          meta,
        });
      }
    } catch (error) {
      dispatch(setError(error));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const fetchUserWalletAddress: ThunkActionCreator<Actions, RootState> =
  (provider: IProvider, address: string) => async dispatch => {
    dispatch(setLoading(true));

    let convertedAddress = address;

    if (provider) {
      const data = await provider.getMetadata();
      convertedAddress = data !== null ? encodeAddress(hexToU8a(address), data) : address;
    }

    dispatch({
      type: constants.FETCH_USER_WALLET_ADDRESS,
      payload: convertedAddress,
    });

    dispatch(setLoading(false));
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
      dispatch(setError(error));
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

      const primaryWallet = wallets.find(wallet => wallet.primary === true);

      if (primaryWallet) {
        const wallet = {
          ...primaryWallet,
          user,
        };
        dispatch({
          type: constants.FETCH_CURRENT_USER_WALLETS,
          payload: wallet,
        });
      }
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
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
      dispatch(setError(error));

      dispatch(resetVerifyingSocial());
    }
  };

export const setUserAsAnonymous: ThunkActionCreator<Actions, RootState> =
  (alias: string) => async dispatch => {
    dispatch(setAnonymous(alias));
  };

export const setDefaultCurrency: ThunkActionCreator<Actions, RootState> =
  (balanceDetails: BalanceDetail[]) => async (dispatch, getState) => {
    dispatch(setLoading(true));
    const {
      userState: {user},
    } = getState();

    if (!user) return;

    dispatch(sortBalances(balanceDetails));
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
      dispatch(setError(error));
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
      dispatch(setError(error));
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
      dispatch(setError(error));
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

      callback && callback();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 422) {
        dispatch(setError(new Error('Token already added to your wallet!')));
      } else {
        dispatch(setError(error));
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

export const fetchNetwork: ThunkActionCreator<Actions, RootState> = () => async dispatch => {
  dispatch(setLoading(true));

  try {
    const {data: networks, meta} = await WalletAPI.getNetworks();
    const filterNetwork: Network[] = [];

    for (const network of networks) {
      const networkWithTips = {
        ...network,
        tips: [],
      };

      if (network.id === NetworkIdEnum.MYRIAD) {
        filterNetwork.unshift(networkWithTips);
      } else {
        filterNetwork.push(networkWithTips);
      }
    }

    dispatch({
      type: constants.FETCH_NETWORK,
      payload: filterNetwork,
      meta,
    });
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};
