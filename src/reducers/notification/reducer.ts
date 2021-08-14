import {PaginationState as BasePaginationState} from '../base/state';
import {Actions} from './actions';
import * as constants from './constants';

import * as Redux from 'redux';
import {Notification} from 'src/interfaces/notification';

export interface NotificationState extends BasePaginationState {
  notifications: Notification[];
}

const initalState: NotificationState = {
  loading: false,
  notifications: [],
  meta: {
    currentPage: 1,
    itemsPerPage: 10,
    totalItemCount: 0,
    totalPageCount: 0,
  },
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
      };
    }

    default: {
      return state;
    }
  }
};
