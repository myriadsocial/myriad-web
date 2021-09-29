import {PaginationState as BasePaginationState} from '../base/state';
import {Actions} from './actions';
import * as constants from './constants';

import * as Redux from 'redux';
import {People} from 'src/interfaces/people';

export interface PeopleState extends BasePaginationState {
  people: People[];
  hasMore: boolean;
  filter?: string;
}

const initalState: PeopleState = {
  loading: false,
  people: [],
  hasMore: false,
  meta: {
    currentPage: 1,
    itemsPerPage: 10,
    totalItemCount: 0,
    totalPageCount: 0,
  },
};

export const PeopleReducer: Redux.Reducer<PeopleState, Actions> = (state = initalState, action) => {
  switch (action.type) {
    case constants.FETCH_PEOPLE: {
      if (action.meta.currentPage === 1) {
        return {
          ...state,
          people: action.people,
          meta: action.meta,
        };
      } else {
        return {
          ...state,
          people: [...state.people, ...action.people],
          meta: action.meta,
        };
      }
    }

    case constants.FILTER_PEOPLE: {
      return {
        ...state,
        people: action.people,
      };
    }

    default: {
      return state;
    }
  }
};
