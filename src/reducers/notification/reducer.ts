import {State as BaseState} from '../base/state';
import {Actions} from './actions';
import * as constants from './constants';

import * as Redux from 'redux';
import {ExtendedNotification} from 'src/interfaces/notification';

export interface NotificationState extends BaseState {
  notifications: ExtendedNotification[];
  total: number;
}

const initalState: NotificationState = {
  loading: false,
  total: 0,
  notifications: [],
};

export const NotificationReducer: Redux.Reducer<NotificationState, Actions> = (
  state = initalState,
  action,
) => {
  switch (action.type) {
    case constants.FETCH_NOTIFICATIION: {
      return {
        ...state,
        notifications: action.notifications,
        total: action.notifications.length,
      };
    }

    case constants.READ_NOTIFICATIION: {
      return {
        ...state,
        total: 0,
      };
    }

    default: {
      return state;
    }
  }
};
