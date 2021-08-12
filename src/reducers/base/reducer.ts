import {Actions} from './actions';
import * as constants from './constants';
import {State as BaseState} from './state';

import * as Redux from 'redux';

const initalState: BaseState = {
  loading: false,
};

export const BaseReducer: Redux.Reducer<BaseState, Actions> = (state = initalState, action) => {
  switch (action.type) {
    case constants.ACTION_FAILED: {
      return {
        ...state,
        error: {
          severity: 'error',
          message: action.error,
        },
      };
    }

    default: {
      return state;
    }
  }
};
