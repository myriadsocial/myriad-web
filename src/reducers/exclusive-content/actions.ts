import * as constants from './constants';

import {Action} from 'redux';
import {ExclusiveContentProps} from 'src/interfaces/post';

/**
 * Action Types
 */

export interface fetchExclusiveContent extends Action {
  type: constants.FETCH_EXCLUSIVE_CONTENT;
  payload: ExclusiveContentProps;
}

export interface SetPaidExclusiveContent extends Action {
  type: constants.PAID_EXCLUSIVE_CONTENT;
  payload: boolean;
}

export interface SetExclusiveContentId extends Action {
  type: constants.SET_EXCLUSIVE_CONTENT_ID;
  payload: string;
}
/**
 * Union Action Types
 */

export type Actions = fetchExclusiveContent | SetPaidExclusiveContent | SetExclusiveContentId;

/**
 *
 * Actions
 */

export const fetchExclusiveContent = (reference: ExclusiveContentProps): fetchExclusiveContent => ({
  type: constants.FETCH_EXCLUSIVE_CONTENT,
  payload: reference,
});

export const SetPaidExclusiveContent = (reference: boolean): SetPaidExclusiveContent => ({
  type: constants.PAID_EXCLUSIVE_CONTENT,
  payload: reference,
});

export const SetExclusiveContentId = (reference: string): SetExclusiveContentId => ({
  type: constants.SET_EXCLUSIVE_CONTENT_ID,
  payload: reference,
});
