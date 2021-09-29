import {Actions as BaseAction, PaginationAction, setLoading, setError} from '../base/actions';
import {RootState} from '../index';
import * as constants from './constants';

import {People} from 'src/interfaces/people';
import * as PeopleAPI from 'src/lib/api/people';
import {ThunkActionCreator} from 'src/types/thunk';

/**
 * Action Types
 */

export interface LoadPeople extends PaginationAction {
  type: constants.FETCH_PEOPLE;
  people: People[];
}

export interface FilterPeople extends PaginationAction {
  type: constants.FILTER_PEOPLE;
  people: People[];
  filter: string;
}

/**
 * Union Action Types
 */

export type Actions = LoadPeople | FilterPeople | BaseAction;

/**
 *
 * Actions
 */

/**
 * Action Creator
 */
export const fetchPeople: ThunkActionCreator<Actions, RootState> =
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

      const {meta, data: people} = await PeopleAPI.getPeople(page);

      dispatch({
        type: constants.FETCH_PEOPLE,
        people,
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

export const searchPeople: ThunkActionCreator<Actions, RootState> =
  (query: string) => async (dispatch, getState) => {
    dispatch(setLoading(true));

    try {
      const {
        userState: {user},
      } = getState();

      if (!user) {
        throw new Error('User not found');
      }

      const {meta, data: people} = await PeopleAPI.searchPeople(query);

      dispatch({
        type: constants.FILTER_PEOPLE,
        people,
        meta,
        filter: query,
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
