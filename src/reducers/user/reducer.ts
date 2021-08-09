import {HYDRATE} from 'next-redux-wrapper';

import {ACTION_FAILED} from '../base/constants';
import {State as BaseState} from '../base/state';
import {Actions} from './actions';
import * as constants from './constants';

import * as Redux from 'redux';
import {Token} from 'src/interfaces/token';
import {ExtendedUser, UserTransactionDetail} from 'src/interfaces/user';

export interface UserState extends BaseState {
  user?: ExtendedUser;
  tokens: Token[];
  transactionDetails: UserTransactionDetail[];
  anonymous: boolean;
  alias: string;
  verifying: boolean;
}

const initalState: UserState = {
  loading: false,
  anonymous: false,
  tokens: [],
  transactionDetails: [],
  alias: '',
  verifying: false,
};

export const UserReducer: Redux.Reducer<UserState, Actions> = (state = initalState, action) => {
  switch (action.type) {
    case HYDRATE: {
      return action.payload.userState;
    }

    case constants.FETCH_USER: {
      return {
        ...state,
        user: action.user,
      };
    }

    case constants.SET_USER_AS_ANONYMOUS: {
      return {
        ...state,
        anonymous: true,
        alias: action.alias,
      };
    }

    case constants.UPDATE_USER: {
      return {
        ...state,
        user: action.user,
      };
    }

    case constants.FETCH_USER_TOKEN: {
      return {
        ...state,
        tokens: action.payload,
      };
    }

    case constants.FETCH_USER_TRANSACTION_DETAILS: {
      return {
        ...state,
        transactionDetails: action.payload,
      };
    }

    case constants.SET_VERIFYING_SOCIAL_ACCOUNT: {
      return {
        ...state,
        verifying: true,
        error: undefined,
      };
    }

    case constants.RESET_VERIFYING_SOCIAL_ACCOUNT: {
      return {
        ...state,
        verifying: false,
        error: undefined,
      };
    }

    case ACTION_FAILED: {
      return {
        ...state,
        error: action.error,
      };
    }

    default: {
      return state;
    }
  }
};
