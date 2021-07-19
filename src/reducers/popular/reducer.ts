import { State as BaseState } from '../base/state';
import { Actions } from './actions';
import * as constants from './constants';

import * as Redux from 'redux';
import { Tag } from 'src/interfaces/experience';

export interface ConfigState extends BaseState {
  topics: Tag[];
}

const initalState: ConfigState = {
  loading: false,
  topics: []
};

export const PopularReducer: Redux.Reducer<ConfigState, Actions> = (state = initalState, action) => {
  switch (action.type) {
    case constants.FETCH_POPULAR_TOPIC: {
      return {
        ...state,
        topics: action.topics
      };
    }

    default: {
      return state;
    }
  }
};
