import * as constants from './constants';

import {Action} from 'redux';

/**
 * Action Types
 */

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

export type Actions = SetPaidExclusiveContent | SetExclusiveContentId;

/**
 *
 * Actions
 */

export const SetPaidExclusiveContent = (reference: boolean): SetPaidExclusiveContent => ({
  type: constants.PAID_EXCLUSIVE_CONTENT,
  payload: reference,
});

export const SetExclusiveContentId = (reference: string): SetExclusiveContentId => ({
  type: constants.SET_EXCLUSIVE_CONTENT_ID,
  payload: reference,
});
