import {Actions as BaseAction, PaginationAction, setLoading, setError} from '../base/actions';
import {RootState} from '../index';
import * as constants from './constants';

import {Friend} from 'src/interfaces/friend';
import {User} from 'src/interfaces/user';
import * as FriendAPI from 'src/lib/api/friends';
import {ThunkActionCreator} from 'src/types/thunk';

/**
 * Action Types
 */

export interface LoadBlockList extends PaginationAction {
  type: constants.FETCH_BLOCKLIST;
  users: Friend[];
}

/**
 * Union Action Types
 */

export type Actions = LoadBlockList | BaseAction;

/**
 *
 * Actions
 */

/**
 * Action Creator
 */
export const getBlockList: ThunkActionCreator<Actions, RootState> =
  (user: User, page = 1) =>
  async (dispatch, getState) => {
    dispatch(setLoading(true));

    try {
      const {meta, data: users} = await FriendAPI.getBlockList(user.id, page);

      dispatch({
        type: constants.FETCH_BLOCKLIST,
        users,
        meta,
      });
    } catch (error) {
      dispatch(
        setError({
          message: error.message,
        }),
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

export const unblockUser: ThunkActionCreator<Actions, RootState> =
  (friendId: string) => async (dispatch, getState) => {
    dispatch(setLoading(true));

    const {
      userState: {user},
    } = getState();

    try {
      if (!user) {
        throw new Error('User not found');
      }

      await FriendAPI.deleteRequest(friendId);

      dispatch(getBlockList(user));
    } catch (error) {
      dispatch(
        setError({
          message: error.message,
        }),
      );
    } finally {
      dispatch(setLoading(false));
    }
  };
