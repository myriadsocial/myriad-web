import {Actions} from './actions';
import * as constants from './constants';

import {ExclusiveContent} from 'components/common/Tipping/Tipping.interface';
import * as Redux from 'redux';

export interface ECState {
  content: ExclusiveContent | null;
  paid: boolean;
  ecId: string;
}

const initalState: ECState = {
  content: null,
  paid: false,
  ecId: '',
};

export const ECReducer: Redux.Reducer<ECState, Actions> = (state = initalState, action) => {
  switch (action.type) {
    case constants.PAID_EXCLUSIVE_CONTENT: {
      return {
        ...state,
        paid: action.payload,
      };
    }

    case constants.SET_EXCLUSIVE_CONTENT_ID: {
      return {
        ...state,
        ecId: action.payload,
      };
    }

    default: {
      return state;
    }
  }
};
