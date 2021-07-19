import { State as BaseState } from '../base/state';
import { Actions } from './actions';
import * as constants from './constants';

import * as Redux from 'redux';
import { ExtendedFriend } from 'src/interfaces/friend';

export interface FriendState extends BaseState {
  friends: ExtendedFriend[];
  requests: ExtendedFriend[];
}

const initalState: FriendState = {
  loading: false,
  friends: [],
  requests: []
};

export const FriendReducer: Redux.Reducer<FriendState, Actions> = (state = initalState, action) => {
  switch (action.type) {
    case constants.FETCH_FRIEND: {
      return {
        ...state,
        friends: action.payload
      };
    }

    default: {
      return state;
    }
  }
};
