import * as constants from './constants';

import {Post} from 'src/interfaces/post';

/**
 * Action Types
 */

export interface SetTippedPost {
  type: constants.SET_TIPPED_POST;
  payload: Post;
}

export interface ClearTippedPost {
  type: constants.CLEAR_TIPPED_POST;
}

/**
 * Union Action Types
 */

export type Actions = SetTippedPost | ClearTippedPost;

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
