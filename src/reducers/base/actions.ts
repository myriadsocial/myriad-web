import {RootState} from '../index';
import * as constants from './constants';

import {Action} from 'redux';
import {ListMeta} from 'src/lib/api/interfaces/base-list.interface';

/**
 * Action Types
 */

export interface LoadingAction extends Action {
  type: constants.ACTION_LOADING;
  loading: boolean;
}

export interface FailedAction extends Action {
  type: constants.ACTION_FAILED;
  payload: unknown;
}

export interface HydrateStateAction extends Action {
  type: constants.HYDRATE;
  payload: RootState;
}

export interface PaginationAction extends Action {
  meta: ListMeta;
}

/**
 * Union Action Types
 */

export type Actions = LoadingAction | FailedAction | HydrateStateAction;

/**
 *
 * Actions
 */

export const setLoading = (loading: boolean): LoadingAction => ({
  type: constants.ACTION_LOADING,
  loading,
});

export const setError = (payload: unknown): FailedAction => ({
  type: constants.ACTION_FAILED,
  payload,
});
