import {State as BaseState} from '../base/state';
import {Actions} from './actions';
import * as constants from './constants';

import * as Redux from 'redux';
import {ExtendedFriend} from 'src/interfaces/friend';

export interface FriendState extends BaseState {
  friends: ExtendedFriend[];
  requests: ExtendedFriend[];
  page: number;
  hasMore: boolean;
  totalFriend: number;
  totalRequest: number;
}

const initalState: FriendState = {
  loading: false,
  friends: [],
  requests: [],
  page: 1,
  hasMore: false,
  totalFriend: 0,
  totalRequest: 0,
};

export const FriendReducer: Redux.Reducer<FriendState, Actions> = (state = initalState, action) => {
  switch (action.type) {
    case constants.FETCH_FRIEND: {
      if (action.meta.page === 1) {
        return {
          ...state,
          friends: action.friends,
          // TODO: get total from API pagination response
          totalFriend: action.friends.length,
        };
      } else {
        return {
          ...state,
          friends: [...state.friends, ...action.friends],
          // TODO: get total from API pagination response
          totalFriend: state.totalFriend + action.friends.length,
          page: state.page + 1,
        };
      }
    }

    case constants.FETCH_FRIEND_REQUEST: {
      return {
        ...state,
        requests: action.requests,
        // TODO: get total from API pagination response
        totalRequest: action.requests.length,
      };
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
