import {HYDRATE} from 'next-redux-wrapper';

import * as BaseConstants from '../base/constants';
import {State as BaseState} from '../base/state';
import {Actions} from './actions';
import * as constants from './constants';

import update from 'immutability-helper';
import * as Redux from 'redux';
import {User} from 'src/interfaces/user';
import {WalletDetail, ContentType} from 'src/interfaces/wallet';

export interface WalletState extends BaseState {
  recipientDetail: WalletDetail;
  tippedUserId: string;
  tippedUser?: User;
}

const initialState: WalletState = {
  loading: false,
  recipientDetail: {
    referenceId: '',
    walletAddress: '',
    contentType: ContentType.POST,
  },
  tippedUserId: '',
};

export const WalletReducer: Redux.Reducer<WalletState, Actions> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case HYDRATE: {
      return action.payload.walletState;
    }

    case constants.FETCH_RECIPIENT_DETAIL: {
      return {
        ...state,
        payload: action.payload,
      };
    }

    case constants.SET_RECIPIENT_DETAIL: {
      return {
        ...state,
        recipientDetail: action.recipientDetail,
      };
    }

    case constants.SET_TIPPED_USER_ID: {
      return {
        ...state,
        tippedUserId: action.tippedUserId,
      };
    }

    case constants.SET_TIPPED_USER: {
      return {
        ...state,
        tippedUser: action.tippedUser,
      };
    }

    case BaseConstants.ACTION_LOADING: {
      return update(state, {
        loading: {$set: action.loading},
      });
    }

    default: {
      return state;
    }
  }
};
