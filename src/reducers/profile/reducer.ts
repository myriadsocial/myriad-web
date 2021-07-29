import {HYDRATE} from 'next-redux-wrapper';

import {State as BaseState} from '../base/state';
import {Actions} from './actions';
import * as constants from './constants';

import * as Redux from 'redux';
import {ExtendedFriend} from 'src/interfaces/friend';
import {ExtendedUser} from 'src/interfaces/user';

export interface ProfileState extends BaseState {
  userId?: string;
  detail?: ExtendedUser;
  friends: ExtendedFriend[];
  totalFriends: number;
}

const initalState: ProfileState = {
  loading: false,
  friends: [],
  totalFriends: 0,
};

export const ProfileReducer: Redux.Reducer<ProfileState, Actions> = (
  state = initalState,
  action,
) => {
  switch (action.type) {
    case HYDRATE: {
      return action.payload.profileState;
    }

    case constants.FETCH_PROFILE_DETAIL: {
      return {
        ...state,
        detail: action.detail,
      };
    }

    case constants.FETCH_PROFILE_FRIEND: {
      return {
        ...state,
        friends: action.friends,
        totalFriends: action.friends.length,
      };
    }

    case constants.FILTER_PROFILE_FRIEND: {
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
