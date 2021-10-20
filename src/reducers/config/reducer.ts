import packageJson from '../../../package.json';
import {State as BaseState} from '../base/state';
import {Actions} from './actions';
import * as constants from './constants';

import * as Redux from 'redux';
import {Currency} from 'src/interfaces/currency';
import {UserSettings} from 'src/interfaces/setting';

export interface ConfigState extends BaseState {
  availableCurrencies: Currency[];
  layout: {
    mobile: boolean;
    focus: boolean;
  };
  settings: UserSettings;
}

const initalState: ConfigState = {
  loading: false,
  availableCurrencies: [],
  layout: {
    mobile: false,
    focus: false,
  },
  settings: {
    version: packageJson.version,
    privacy: {
      account: 'public',
      social: 'public',
    },
    notification: {
      comment: true,
      tip: true,
      mention: true,
      friend: true,
    },
  },
};

export const ConfigReducer: Redux.Reducer<ConfigState, Actions> = (state = initalState, action) => {
  switch (action.type) {
    case constants.FETCH_AVAILABLE_TOKEN: {
      return {
        ...state,
        availableCurrencies: action.payload,
      };
    }

    case constants.UPDATE_PRIVACY_SETTING: {
      return {
        ...state,
        settings: {
          ...state.settings,
          privacy: {
            ...state.settings.privacy,
            [action.key]: action.value,
          },
        },
      };
    }

    case constants.UPDATE_NOTIFICATION_SETTING: {
      return {
        ...state,
        settings: {
          ...state.settings,
          notification: action.settings,
        },
      };
    }

    default: {
      return state;
    }
  }
};
