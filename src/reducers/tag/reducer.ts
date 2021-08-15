import {PaginationState as BasePaginationState} from '../base/state';
import {Actions} from './actions';
import * as constants from './constants';

import * as Redux from 'redux';
import {Tag} from 'src/interfaces/experience';

export interface TagState extends BasePaginationState {
  topics: Tag[];
  trending: Tag[];
}

const initalState: TagState = {
  loading: false,
  topics: [],
  trending: [],
  meta: {
    currentPage: 1,
    itemsPerPage: 10,
    totalItemCount: 0,
    totalPageCount: 0,
  },
};

export const TagReducer: Redux.Reducer<TagState, Actions> = (state = initalState, action) => {
  switch (action.type) {
    case constants.FETCH_POPULAR_TOPIC: {
      return {
        ...state,
        trending: action.topics,
      };
    }

    default: {
      return state;
    }
  }
};
