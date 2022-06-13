import {Actions as BaseAction, PaginationAction, setLoading, setError} from '../base/actions';
import {RootState} from '../index';
import * as constants from './constants';

import {Action} from 'redux';
import {Comment} from 'src/interfaces/comment';
import {User} from 'src/interfaces/user';
import * as CommmentAPI from 'src/lib/api/comment';
import {PaginationParams} from 'src/lib/api/interfaces/pagination-params.interface';
import {ThunkActionCreator} from 'src/types/thunk';

/**
 * Action Types
 */

export interface LoadComments extends PaginationAction {
  type: constants.FETCH_COMMENT;
  comments: Comment[];
}

export interface UpdateCommentFilter extends Action {
  type: constants.SET_COMMENT_FILTER;
  params: PaginationParams;
}

/**
 * Union Action Types
 */

export type Actions = LoadComments | UpdateCommentFilter | BaseAction;

/**
 *
 * Actions
 */
export const updateCommentParams = (params: PaginationParams): UpdateCommentFilter => ({
  type: constants.SET_COMMENT_FILTER,
  params,
});

/**
 * Action Creator
 */
export const fetchCommentHistory: ThunkActionCreator<Actions, RootState> =
  (user: User, page = 1) =>
  async (dispatch, getState) => {
    const {
      commentState: {params},
    } = getState();

    dispatch(setLoading(true));

    try {
      const {meta, data: comments} = await CommmentAPI.loadUserComments(user.id, {...params, page});

      dispatch({
        type: constants.FETCH_COMMENT,
        comments,
        meta,
      });
    } catch (error) {
      dispatch(setError(error));
    } finally {
      dispatch(setLoading(false));
    }
  };
