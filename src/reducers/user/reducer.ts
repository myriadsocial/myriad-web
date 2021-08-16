import {HYDRATE} from 'next-redux-wrapper';

import {State as BaseState} from '../base/state';
import {Actions} from './actions';
import * as constants from './constants';

import * as Redux from 'redux';
import {generateImageSizes} from 'src/helpers/cloudinary';
import {ImageSizes} from 'src/interfaces/assets';
import {SocialMedia} from 'src/interfaces/social';
import {Token} from 'src/interfaces/token';
import {User, UserTransactionDetail} from 'src/interfaces/user';

export interface UserState extends BaseState {
  user?: User & {
    profilePicture: ImageSizes;
  };
  socials: SocialMedia[];
  tokens: Token[];
  transactionDetail: UserTransactionDetail;
  anonymous: boolean;
  alias: string;
  verifying: boolean;
}

const initalState: UserState = {
  loading: false,
  anonymous: false,
  tokens: [],
  socials: [],
  transactionDetail: {
    sent: [],
    received: [],
  },
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
        user: {
          ...action.user,
          profilePicture: {
            sizes: generateImageSizes(action.user.profilePictureURL || ''),
          },
        },
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
        user: {
          ...action.user,
          profilePicture: {
            sizes: generateImageSizes(action.user.profilePictureURL || ''),
          },
        },
      };
    }

    case constants.FETCH_USER_TOKEN: {
      return {
        ...state,
        tokens: action.payload,
      };
    }

    case constants.FETCH_USER_TRANSACTION_DETAIL: {
      return {
        ...state,
        transactionDetail: action.payload,
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

    default: {
      return state;
    }
  }
};
