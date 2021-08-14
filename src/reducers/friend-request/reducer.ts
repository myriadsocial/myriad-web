import {PaginationState as BasePaginationState} from '../base/state';
import {Actions} from './actions';
import * as constants from './constants';

import * as Redux from 'redux';
import {Friend} from 'src/interfaces/friend';

export interface FriendRequestState extends BasePaginationState {
  requests: Friend[];
  hasMore: boolean;
}

const initalState: FriendRequestState = {
  loading: false,
  requests: [],
  hasMore: false,
  meta: {
    currentPage: 1,
    itemsPerPage: 10,
    totalItemCount: 0,
    totalPageCount: 0,
  },
};

export const FriendRequestReducer: Redux.Reducer<FriendRequestState, Actions> = (
  state = initalState,
  action,
) => {
  switch (action.type) {
    case constants.FETCH_FRIEND_REQUEST: {
      return {
        ...state,
        requests: action.requests,
        // TODO: get total from API pagination response
        totalRequest: action.requests.length,
      };
    }

    default: {
      return state;
    }
  }
};
