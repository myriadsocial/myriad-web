import {State as BaseState} from '../base/state';
import {Actions} from './actions';
import * as constants from './constants';

import * as Redux from 'redux';
import {Currency} from 'src/interfaces/currency';

export interface ConfigState extends BaseState {
  availableCurrencies: Currency[];
  layout: {
    mobile: boolean;
    focus: boolean;
  };
}

const initalState: ConfigState = {
  loading: false,
  availableCurrencies: [],
  layout: {
    mobile: false,
    focus: false,
  },
};

export const ConfigReducer: Redux.Reducer<ConfigState, Actions> = (state = initalState, action) => {
  switch (action.type) {
    case constants.FETCH_AVAILABLE_TOKEN: {
      return {
        ...state,
        availableCurrencies: action.payload,
      };
    }

    default: {
      return state;
    }
  }
};
