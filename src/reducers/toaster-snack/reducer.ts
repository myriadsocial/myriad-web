import {Actions} from './actions';
import * as constants from './constants';

import {VariantType} from 'notistack';
import * as Redux from 'redux';

export interface ToasterSnackState {
  variant: VariantType;
  message: string;
  key: string | number;
}

export interface ToasterNotificationState {
  notifications: ToasterSnackState[];
  displayed: (string | number)[];
}

const initialState: ToasterNotificationState = {
  notifications: [],
  displayed: [],
};

export const ToasterSnackReducer: Redux.Reducer<ToasterNotificationState, Actions> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case constants.SHOW_TOASTER_SNACK: {
      const _notif: ToasterSnackState = {
        variant: action.variant,
        message: action.message,
        key: action.key || new Date().getTime() + Math.random(),
      };
      return {
        ...state,
        notifications: [...state.notifications, _notif],
      };
    }

    case constants.CLOSE_TOASTER_SNACK: {
      return {
        ...state,
        notifications: [...state.notifications].filter(ar => ar.key !== action.key),
      };
    }

    case constants.STORE_DISPLAYED_TOAST_SNACK: {
      return {
        ...state,
        displayed: [...state.displayed, action.key],
      };
    }

    case constants.CLEAR_DISPLAYED_TOAST_SNACK: {
      return {
        ...state,
        displayed: [...state.displayed].filter(ar => ar !== action.key),
      };
    }

    default: {
      return state;
    }
  }
};
