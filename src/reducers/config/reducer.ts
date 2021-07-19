import { State as BaseState } from '../base/state';
import { Actions } from './actions';
import * as constants from './constants';

import * as Redux from 'redux';
import { Token } from 'src/interfaces/token';

export interface ConfigState extends BaseState {
  tokens: Token[];
  layout: {
    mobile: boolean;
    focus: boolean;
  };
}

const initalState: ConfigState = {
  loading: false,
  tokens: [],
  layout: {
    mobile: false,
    focus: false
  }
};

export const ConfigReducer: Redux.Reducer<ConfigState, Actions> = (state = initalState, action) => {
  switch (action.type) {
    case constants.FETCH_AVAILABLE_TOKEN: {
      return {
        ...state,
        tokens: action.payload
      };
    }

    default: {
      return state;
    }
  }
};
