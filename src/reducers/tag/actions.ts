import {Actions as BaseAction, setLoading, setError} from '../base/actions';
import {RootState} from '../index';
import * as constants from './constants';

import {Action} from 'redux';
import {Tag} from 'src/interfaces/experience';
import * as TagAPI from 'src/lib/api/tag';
import {ThunkActionCreator} from 'src/types/thunk';

/**
 * Action Types
 */

export interface FetchPopularTopic extends Action {
  type: constants.FETCH_POPULAR_TOPIC;
  topics: Tag[];
}

/**
 * Union Action Types
 */

export type Actions = FetchPopularTopic | BaseAction;

/**
 *
 * Actions
 */

/**
 * Action Creator
 */
export const fetchPopularTopic: ThunkActionCreator<Actions, RootState> = () => async dispatch => {
  dispatch(setLoading(true));

  try {
    const {data: topics} = await TagAPI.trendingTopic();

    dispatch({
      type: constants.FETCH_POPULAR_TOPIC,
      topics,
    });
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};
