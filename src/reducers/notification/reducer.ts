import { State as BaseState } from '../base/state';
import { Actions } from './actions';
import * as constants from './constants';

import * as Redux from 'redux';
import { ExtendedNotification } from 'src/interfaces/notification';

export interface NotificationState extends BaseState {
  notifications: ExtendedNotification[];
}

const initalState: NotificationState = {
  loading: false,
  notifications: []
};

export const NotificationReducer: Redux.Reducer<NotificationState, Actions> = (state = initalState, action) => {
  switch (action.type) {
    case constants.FETCH_NOTIFICATIION: {
      return {
        ...state,
        notifications: action.notifications
      };
    }

    default: {
      return state;
    }
  }
};
