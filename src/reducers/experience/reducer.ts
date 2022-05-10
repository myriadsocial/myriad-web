import {PaginationState as BasePaginationState} from '../base/state';
import {Actions} from './actions';
import * as constants from './constants';

import update from 'immutability-helper';
import * as Redux from 'redux';
import {Experience, Tag} from 'src/interfaces/experience';
import {People} from 'src/interfaces/people';

export interface ExperienceState extends BasePaginationState {
  experiences: Experience[];
  trendingExperiences: Experience[];
  selectedExperience?: Experience;
  searchPeople: People[];
  searchTags: Tag[];
  hasMore: boolean;
  filter?: string;
  detail?: Experience;
}

const initialState: ExperienceState = {
  loading: false,
  experiences: [],
  trendingExperiences: [],
  searchPeople: [],
  searchTags: [],
  hasMore: false,
  meta: {
    currentPage: 1,
    itemsPerPage: 10,
    totalItemCount: 0,
    totalPageCount: 0,
  },
};

export const ExperienceReducer: Redux.Reducer<ExperienceState, Actions> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case constants.CLEAR_EXPERIENCES: {
      return initialState;
    }

    case constants.FETCH_EXPERIENCE: {
      if (!action.meta.currentPage || action.meta.currentPage === 1) {
        return {
          ...state,
          experiences: action.experiences,
          meta: action.meta,
          hasMore: action.meta.currentPage < action.meta.totalPageCount,
        };
      } else {
        return {
          ...state,
          friends: [...state.experiences, ...action.experiences],
          meta: action.meta,
          hasMore: action.meta.currentPage < action.meta.totalPageCount,
        };
      }
    }

    case constants.FETCH_TRENDING_EXPERIENCE: {
      return {
        ...state,
        trendingExperiences: action.experiences,
      };
    }

    case constants.FETCH_DETAIL_EXPERIENCE: {
      return {
        ...state,
        detail: action.experience,
      };
    }

    case constants.SEARCH_EXPERIENCE: {
      return {
        ...state,
        experiences: [...state.experiences, ...action.experiences],
        meta: action.meta,
        hasMore: action.meta.currentPage < action.meta.totalPageCount,
      };
    }

    case constants.SEARCH_PEOPLE: {
      return {
        ...state,
        searchPeople: action.people,
      };
    }

    case constants.SEARCH_TAGS: {
      return {
        ...state,
        searchTags: action.tags,
      };
    }

    case constants.EXPERIENCE_LOADING: {
      return update(state, {
        loading: {$set: action.loading},
      });
    }

    default: {
      return state;
    }
  }
};
