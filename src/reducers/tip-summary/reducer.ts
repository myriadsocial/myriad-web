import {HYDRATE} from 'next-redux-wrapper';

import {State as BaseState} from '../base/state';
import {Actions} from './actions';
import * as constants from './constants';

import * as Redux from 'redux';
import {Post} from 'src/interfaces/post';

export interface TipSummaryState extends BaseState {
  post: Post | null;
}

const initialState: TipSummaryState = {
  post: null,
  loading: false,
};

export const TipSummaryReducer: Redux.Reducer<TipSummaryState, Actions> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case HYDRATE: {
      return action.payload.tipSummaryState;
    }

    case constants.SET_TIPPED_POST: {
      return {
        ...state,
        post: action.payload,
      };
    }

    case constants.CLEAR_TIPPED_POST: {
      return initialState;
    }

    default: {
      return state;
    }
  }
};
