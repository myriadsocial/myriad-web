import {Actions as BaseAction} from '../base/actions';
import * as constants from './constants';

import {Action} from 'redux';
import {Post} from 'src/interfaces/post';

/**
 * Action Types
 */

export interface SetTippedPost extends Action {
  type: constants.SET_TIPPED_POST;
  payload: Post;
}

export interface ClearTippedPost extends Action {
  type: constants.CLEAR_TIPPED_POST;
}

/**
 * Union Action Types
 */

export type Actions = SetTippedPost | ClearTippedPost | BaseAction;

/**
 *
 * Actions
 */
export const setTippedPost = (post: Post): SetTippedPost => ({
  type: constants.SET_TIPPED_POST,
  payload: post,
});

export const clearTippedPost = (): ClearTippedPost => ({
  type: constants.CLEAR_TIPPED_POST,
});
