import {PaginationState as BasePaginationState} from '../base/state';
import {Actions} from './actions';
import * as constants from './constants';

import * as Redux from 'redux';
import {Friend} from 'src/interfaces/friend';

export interface BlockState extends BasePaginationState {
  users: Friend[];
  hasMore: boolean;
}

const initalState: BlockState = {
  loading: false,
  users: [],
  hasMore: false,
  meta: {
    currentPage: 1,
    itemsPerPage: 10,
    totalItemCount: 0,
    totalPageCount: 0,
  },
};

export const BlockReducer: Redux.Reducer<BlockState, Actions> = (state = initalState, action) => {
  switch (action.type) {
    case constants.FETCH_BLOCKLIST: {
      if (!action.meta.currentPage || action.meta.currentPage === 1) {
        return {
          ...state,
          users: action.users,
          meta: action.meta,
        };
      } else {
        return {
          ...state,
          users: [...state.users, ...action.users],
          meta: action.meta,
        };
      }
    }
    default: {
      return state;
    }
  }
};
