import {Actions as BaseAction, PaginationAction, setLoading, setError} from '../base/actions';
import {fetchFriend} from '../friend/actions';
import {RootState} from '../index';
import * as constants from './constants';

import {Action} from 'redux';
import {Notification, NotificationProps, NotificationType} from 'src/interfaces/notification';
import * as NotificationAPI from 'src/lib/api/notification';
import {ThunkActionCreator} from 'src/types/thunk';

/**
 * Action Types
 */

export interface FetchNotification extends PaginationAction {
  type: constants.FETCH_NOTIFICATION;
  notifications: Notification[];
}

export interface ReadNotification extends Action {
  type: constants.READ_NOTIFICATION;
  notificationId: string;
}

export interface TotalNewNotification extends Action {
  type: constants.TOTAL_NEW_NOTIFICATION;
  total: number;
}

export interface MarkAllRead extends Action {
  type: constants.MARK_ALL_READ;
}

export interface ClearNotifiactionCount extends Action {
  type: constants.CLEAR_NOTIFIACTION_COUNT;
}

/**
 * Union Action Types
 */

export type Actions =
  | FetchNotification
  | ReadNotification
  | TotalNewNotification
  | MarkAllRead
  | ClearNotifiactionCount
  | BaseAction;

/**
 *
 * Actions
 */

/**
 * Action Creator
 */
export const fetchNotification: ThunkActionCreator<Actions, RootState> =
  (page = 1) =>
  async (dispatch, getState) => {
    dispatch(setLoading(true));

    try {
      const {
        userState: {user},
      } = getState();

      if (!user) {
        throw new Error('User not found');
      }

      const {data: notifications, meta} = await NotificationAPI.getNotification(user.id, page);

      dispatch({
        type: constants.FETCH_NOTIFICATION,
        notifications,
        meta,
      });
    } catch (error) {
      dispatch(setError(error));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const readNotification: ThunkActionCreator<Actions, RootState> =
  (notificationId: string, callback?: () => void) => async (dispatch, getState) => {
    dispatch(setLoading(true));

    try {
      const {
        userState: {user},
      } = getState();

      if (!user) {
        throw new Error('User not found');
      }

      await NotificationAPI.markAsRead(notificationId);

      dispatch({
        type: constants.READ_NOTIFICATION,
        notificationId,
      });

      callback && callback();
    } catch (error) {
      dispatch(setError(error));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const readAllNotifications: ThunkActionCreator<Actions, RootState> =
  () => async (dispatch, getState) => {
    dispatch(setLoading(true));

    try {
      const {
        userState: {user},
      } = getState();

      if (!user) {
        throw new Error('User not found');
      }

      await NotificationAPI.markItemsAsRead();

      dispatch({
        type: constants.MARK_ALL_READ,
      });

      dispatch({
        type: constants.CLEAR_NOTIFIACTION_COUNT,
      });
    } catch (error) {
      dispatch(setError(error));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const countNewNotification: ThunkActionCreator<Actions, RootState> =
  () => async (dispatch, getState) => {
    dispatch(setLoading(true));

    try {
      const {
        userState: {user},
      } = getState();

      if (!user) {
        throw new Error('User not found');
      }

      const total: number = await NotificationAPI.countNewNotification(user.id);

      dispatch({
        type: constants.TOTAL_NEW_NOTIFICATION,
        total,
      });
    } catch (error) {
      dispatch(setError(error));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const processNotification: ThunkActionCreator<Actions, RootState> =
  (notification: NotificationProps) => async (dispatch, getState) => {
    const {
      userState: {user},
    } = getState();

    if (!user) return;

    if (
      [NotificationType.FRIEND_REQUEST, NotificationType.FRIEND_ACCEPT].includes(notification.type)
    ) {
      dispatch(fetchFriend(user));
    }
  };
