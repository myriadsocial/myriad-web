import {State as BaseState} from '../base/state';
import {Actions} from './actions';
import * as constants from './constants';

import * as Redux from 'redux';
import {ExtendedFriend} from 'src/interfaces/friend';

export interface FriendState extends BaseState {
  friends: ExtendedFriend[];
  requests: ExtendedFriend[];
  totalFriend: number;
  totalRequest: number;
}

const initalState: FriendState = {
  loading: false,
  friends: [],
  requests: [],
  totalFriend: 0,
  totalRequest: 0,
};

export const FriendReducer: Redux.Reducer<FriendState, Actions> = (state = initalState, action) => {
  switch (action.type) {
    case constants.FETCH_FRIEND: {
      return {
        ...state,
        friends: action.friends,
        // TODO: get total from API
        totalFriend: action.friends.length,
      };
    }

    case constants.FETCH_FRIEND_REQUEST: {
      return {
        ...state,
        requests: action.requests,
        // TODO: get total from API
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
