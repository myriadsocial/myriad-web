import { State as BaseState } from '../base/state';
import { Actions } from './actions';
import * as constants from './constants';

import * as Redux from 'redux';
import { Post } from 'src/interfaces/post';
import { TimelineType, TimelineSortMethod, TimelineFilter } from 'src/interfaces/timeline';

export interface TimelineState extends BaseState {
  type: TimelineType;
  sort: TimelineSortMethod;
  filter?: TimelineFilter;
  hasMore: boolean;
  page: number;
  posts: Post[];
}

const initalState: TimelineState = {
  loading: false,
  page: 1,
  type: TimelineType.DEFAULT,
  sort: 'created',
  hasMore: true,
  posts: []
};

export const TimelineReducer: Redux.Reducer<TimelineState, Actions> = (state = initalState, action) => {
  switch (action.type) {
    case constants.LOAD_TIMELINE: {
      return {
        ...state,
        posts: action.meta.page === 1 ? action.posts : [...state.posts, ...action.posts],
        page: action.meta.page,
        type: action.meta.type ?? state.type
      };
    }

    default: {
      return state;
    }
  }
};
