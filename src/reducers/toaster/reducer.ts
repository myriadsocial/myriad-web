import {Status} from '../../interfaces/toaster';
import {State as BaseState} from '../base/state';
import {Actions} from './actions';
import * as constants from './constants';

import * as Redux from 'redux';

export interface ToasterState extends BaseState {
  toasterStatus: Status | null;
  message: string;
  open: boolean;
}

const initialState: ToasterState = {
  loading: false,
  toasterStatus: null,
  message: '',
  open: false,
};

export const ToasterReducer: Redux.Reducer<ToasterState, Actions> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case constants.SHOW_TOASTER: {
      return {
        ...state,
        toasterStatus: action.toasterStatus,
        message: action.message,
        open: true,
      };
    }

    case constants.CLOSE_TOASTER: {
      return initialState;
    }

    default: {
      return state;
    }
  }
};
