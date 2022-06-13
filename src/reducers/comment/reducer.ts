import {PaginationState as BasePaginationState} from '../base/state';
import {Actions} from './actions';
import * as constants from './constants';

import * as Redux from 'redux';
import {Comment} from 'src/interfaces/comment';
import {PaginationParams} from 'src/lib/api/interfaces/pagination-params.interface';

export interface CommentState extends BasePaginationState {
  comments: Comment[];
  hasMore: boolean;
  filter?: string;
  params?: PaginationParams;
}

const initalState: CommentState = {
  loading: false,
  comments: [],
  hasMore: false,

  meta: {
    currentPage: 1,
    itemsPerPage: 10,
    totalItemCount: 0,
    totalPageCount: 0,
  },
};

export const CommentReducer: Redux.Reducer<CommentState, Actions> = (
  state = initalState,
  action,
) => {
  switch (action.type) {
    case constants.FETCH_COMMENT: {
      if (!action.meta.currentPage || action.meta.currentPage === 1) {
        return {
          ...state,
          comments: action.comments,
          meta: action.meta,
          hasMore: action.meta.currentPage < action.meta.totalPageCount,
        };
      }

      return {
        ...state,
        comments: [...state.comments, ...action.comments],
        meta: action.meta,
        hasMore: action.meta.currentPage < action.meta.totalPageCount,
      };
    }

    case constants.SET_COMMENT_FILTER: {
      return {
        ...state,
        params: action.params,
      };
    }

    default: {
      return state;
    }
  }
};
