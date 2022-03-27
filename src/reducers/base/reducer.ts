import {Actions} from './actions';
import * as constants from './constants';
import {State as BaseState} from './state';

import axios from 'axios';
import * as Redux from 'redux';

const initalState: BaseState = {
  loading: false,
};

export const BaseReducer: Redux.Reducer<BaseState, Actions> = (state = initalState, action) => {
  switch (action.type) {
    case constants.ACTION_FAILED: {
      if (action.payload instanceof Error) {
        return {
          ...state,
          error: {
            severity: 'error',
            title: action.payload.name,
            message: action.payload.message,
          },
        };
      }

      if (axios.isAxiosError(action.payload)) {
        return {
          ...state,
          error: {
            severity: 'error',
            title: action.payload.response?.data.error.name,
            message: action.payload.response?.data.error.message,
          },
        };
      }

      return state;
    }

    default: {
      return state;
    }
  }
};
