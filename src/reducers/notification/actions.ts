import {Actions as BaseAction, setLoading, setError} from '../base/actions';
import {RootState} from '../index';
import * as constants from './constants';

import {Action} from 'redux';
import {ExtendedNotification} from 'src/interfaces/notification';
import * as NotifAPI from 'src/lib/api/notification';
import {ThunkActionCreator} from 'src/types/thunk';

/**
 * Action Types
 */

export interface FetchNotification extends Action {
  type: constants.FETCH_NOTIFICATIION;
  notifications: ExtendedNotification[];
}

/**
 * Union Action Types
 */

export type Actions = FetchNotification | BaseAction;

/**
 *
 * Actions
 */

/**
 * Action Creator
 */
export const fetchNotification: ThunkActionCreator<Actions, RootState> =
  () => async (dispatch, getState) => {
    dispatch(setLoading(true));

    try {
      const {
        userState: {user},
      } = getState();

      if (!user) {
        throw new Error('User not found');
      }

      const notifications: ExtendedNotification[] = await NotifAPI.getMyNotification(user.id);

      dispatch({
        type: constants.FETCH_NOTIFICATIION,
        notifications,
      });
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };
