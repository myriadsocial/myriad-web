import {Actions as BaseAction, setLoading, setError} from '../base/actions';
import {RootState} from '../index';
import * as constants from './constants';

import {Action} from 'redux';
import {Currency} from 'src/interfaces/currency';
import {
  NotificationSettingItems,
  PrivacySettings,
  LanguageSettingType,
} from 'src/interfaces/setting';
import * as SettingAPI from 'src/lib/api/setting';
import * as TokenAPI from 'src/lib/api/token';
import {ThunkActionCreator} from 'src/types/thunk';

/**
 * Action Types
 */
export interface FetchAvailableToken extends Action {
  type: constants.FETCH_AVAILABLE_TOKEN;
  payload: Currency[];
}

export interface FetchFilteredToken extends Action {
  type: constants.FETCH_FILTERED_TOKEN;
  payload: Currency[];
}

export interface LoadingConfig extends Action {
  type: constants.SET_LOADING_CONFIG;
  payload: boolean;
}
export interface UpdateNotificationSetting extends Action {
  type: constants.UPDATE_NOTIFICATION_SETTING;
  settings: NotificationSettingItems;
}
export interface FetchPrivacySetting extends Action {
  type: constants.FETCH_PRIVACY_SETTING;
  settings: PrivacySettings;
}

export interface SetLanguageSetting extends Action {
  type: constants.SET_LANGUAGE_SETTING;
  lang: LanguageSettingType;
}

/**
 * Union Action Types
 */

export type Actions =
  | FetchAvailableToken
  | FetchFilteredToken
  | FetchPrivacySetting
  | UpdateNotificationSetting
  | SetLanguageSetting
  | BaseAction
  | LoadingConfig;

/**
 *
 * Actions
 */

/**
 * Action Creator
 */

export const setLoadingConfig = (loading: boolean): LoadingConfig => ({
  type: constants.SET_LOADING_CONFIG,
  payload: loading,
});

export const fetchAccountPrivacySetting: ThunkActionCreator<Action, RootState> =
  (id: string) => async dispatch => {
    dispatch(setLoading(true));
    try {
      const data = await SettingAPI.getAccountSettings(id);
      dispatch({
        type: constants.FETCH_PRIVACY_SETTING,
        settings: {
          accountPrivacy: data.accountPrivacy,
          socialMediaPrivacy: data.socialMediaPrivacy,
        },
      });
    } catch (error) {
      dispatch(setError(error));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const setPrivacySetting = (privacySetting: PrivacySettings): FetchPrivacySetting => ({
  type: constants.FETCH_PRIVACY_SETTING,
  settings: {
    accountPrivacy: privacySetting.accountPrivacy,
    socialMediaPrivacy: privacySetting.socialMediaPrivacy,
  },
});

export const updatePrivacySetting: ThunkActionCreator<Action, RootState> =
  (id: string, payload: PrivacySettings, callback?: () => void) => async dispatch => {
    dispatch(setLoading(true));
    try {
      await SettingAPI.updateAccountSettings(id, payload);
      dispatch({
        type: constants.FETCH_PRIVACY_SETTING,
        settings: payload,
      });
      callback && callback();
    } catch (error) {
      dispatch(setError(error));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const updateNotificationSetting: ThunkActionCreator<Action, RootState> =
  (id: string, settings: NotificationSettingItems, callback?: () => void) => async dispatch => {
    dispatch(setLoading(true));

    try {
      await SettingAPI.updateNotificationSettings(id, settings);
      dispatch({
        type: constants.UPDATE_NOTIFICATION_SETTING,
        settings,
      });
      callback && callback();
    } catch (error) {
      dispatch(setError(error));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const fetchNotificationSetting: ThunkActionCreator<Action, RootState> =
  (id: string) => async dispatch => {
    dispatch(setLoading(true));

    try {
      const data = await SettingAPI.getNotificationSettings(id);
      dispatch({
        type: constants.UPDATE_NOTIFICATION_SETTING,
        settings: {
          mentions: data.mentions,
          comments: data.comments,
          friendRequests: data.friendRequests,
          tips: data.tips,
        },
      });
    } catch (error) {
      dispatch(setError(error));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const fetchAvailableToken: ThunkActionCreator<Actions, RootState> = () => async dispatch => {
  dispatch(setLoading(true));

  try {
    const {data: currencies} = await TokenAPI.getTokens();

    dispatch({
      type: constants.FETCH_AVAILABLE_TOKEN,
      payload: currencies,
    });
  } catch (error) {
    dispatch(setError(error));
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchFilteredToken: ThunkActionCreator<Actions, RootState> = () => async dispatch => {
  dispatch(setLoading(true));

  try {
    const filter = {
      where: {
        or: [{networkId: 'myriad'}, {networkId: 'debio'}],
      },
    };
    const {data: currencies} = await TokenAPI.getFilteredTokens(filter, 1, 10);

    dispatch({
      type: constants.FETCH_FILTERED_TOKEN,
      payload: currencies,
    });
  } catch (error) {
    dispatch(setError(error));
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchLanguageSetting: ThunkActionCreator<Actions, RootState> =
  (id: string) => async dispatch => {
    dispatch(setLoading(true));

    try {
      // TODO fetch data language from backend
    } catch (error) {
      dispatch(setError(error));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const updateLanguageSetting: ThunkActionCreator<Actions, RootState> =
  (id: string, language: LanguageSettingType) => async dispatch => {
    //TODO hit backend to store the preferred language
    dispatch({
      type: constants.SET_LANGUAGE_SETTING,
      lang: language,
    });
  };

export const sendVerificationEmail: ThunkActionCreator<Actions, RootState> =
  (
    payload: Parameters<typeof SettingAPI.sendVerificationEmailServices>[0],
    callbackSuccess: () => void,
  ) =>
  async dispatch => {
    dispatch(setLoadingConfig(true));

    try {
      await SettingAPI.sendVerificationEmailServices(payload);
      callbackSuccess();
    } catch (error) {
      dispatch(setError(error));
    } finally {
      dispatch(setLoadingConfig(false));
    }
  };

export const updateEmail: ThunkActionCreator<Actions, RootState> =
  (payload: Parameters<typeof SettingAPI.updateEmail>[0], callbackAfterUpdate: () => void) =>
  async dispatch => {
    dispatch(setLoadingConfig(true));
    try {
      await SettingAPI.updateEmail(payload);
    } catch (error) {
      dispatch(setError(error));
    } finally {
      dispatch(setLoadingConfig(false));
      callbackAfterUpdate();
    }
  };

export const deleteEmail: ThunkActionCreator<Actions, RootState> =
  (payload: Parameters<typeof SettingAPI.deleteEmail>[0], callbackSuccess: () => void) =>
  async dispatch => {
    dispatch(setLoadingConfig(true));
    try {
      await SettingAPI.deleteEmail(payload);
      callbackSuccess();
    } catch (error) {
      dispatch(setError(error));
    } finally {
      dispatch(setLoadingConfig(false));
    }
  };
