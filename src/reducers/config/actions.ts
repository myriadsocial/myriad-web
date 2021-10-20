import {Actions as BaseAction, setLoading, setError} from '../base/actions';
import {RootState} from '../index';
import * as constants from './constants';

import {Action} from 'redux';
import {Currency} from 'src/interfaces/currency';
import {NotificationSettingItems, PrivacySettingType, PrivacyType} from 'src/interfaces/setting';
import * as TokenAPI from 'src/lib/api/token';
import {ThunkActionCreator} from 'src/types/thunk';

/**
 * Action Types
 */

export interface FetchAvailableToken extends Action {
  type: constants.FETCH_AVAILABLE_TOKEN;
  payload: Currency[];
}

export interface UpdatePrivacySetting extends Action {
  type: constants.UPDATE_PRIVACY_SETTING;
  key: PrivacySettingType;
  value: PrivacyType;
}
export interface UpdateNotificationSetting extends Action {
  type: constants.UPDATE_NOTIFICATION_SETTING;
  settings: NotificationSettingItems;
}

/**
 * Union Action Types
 */

export type Actions =
  | FetchAvailableToken
  | UpdatePrivacySetting
  | UpdateNotificationSetting
  | BaseAction;

/**
 *
 * Actions
 */
export const updatePrivacySetting = (
  key: PrivacySettingType,
  value: PrivacyType,
): UpdatePrivacySetting => ({
  type: constants.UPDATE_PRIVACY_SETTING,
  key,
  value,
});

export const updateNotificationSetting = (
  settings: NotificationSettingItems,
): UpdateNotificationSetting => ({
  type: constants.UPDATE_NOTIFICATION_SETTING,
  settings,
});

/**
 * Action Creator
 */
export const fetchAvailableToken: ThunkActionCreator<Actions, RootState> = () => async dispatch => {
  dispatch(setLoading(true));

  try {
    const {data: currencies} = await TokenAPI.getTokens();

    dispatch({
      type: constants.FETCH_AVAILABLE_TOKEN,
      payload: currencies,
    });
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};
