import {Actions} from './actions';
import * as constants from './constants';

import * as Redux from 'redux';
import {ExclusiveContentProps} from 'src/interfaces/post';

export interface ECState {
  content: ExclusiveContentProps | null;
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
    case constants.FETCH_EXCLUSIVE_CONTENT: {
      return {
        ...state,
        content: action.payload,
      };
    }

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
