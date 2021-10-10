import {PaginationState as BasePaginationState} from '../base/state';
import {Actions} from './actions';
import * as constants from './constants';

import * as Redux from 'redux';
import {Friend} from 'src/interfaces/friend';

export interface FriendState extends BasePaginationState {
  friends: Friend[];
  hasMore: boolean;
  filter?: string;
}

const initalState: FriendState = {
  loading: false,
  friends: [],
  hasMore: false,
  meta: {
    currentPage: 1,
    itemsPerPage: 10,
    totalItemCount: 0,
    totalPageCount: 0,
  },
};

export const FriendReducer: Redux.Reducer<FriendState, Actions> = (state = initalState, action) => {
  switch (action.type) {
    case constants.FETCH_FRIEND: {
      if (!action.meta.currentPage || action.meta.currentPage === 1) {
        return {
          ...state,
          friends: action.friends,
          meta: action.meta,
        };
      } else {
        return {
          ...state,
          friends: [...state.friends, ...action.friends],
          meta: action.meta,
        };
      }
    }

    case constants.FILTER_FRIEND: {
      return {
        ...state,
        friends: action.friends,
      };
    }

    default: {
      return state;
    }
  }
};
