import {PaginationState as BasePaginationState} from '../base/state';
import {Actions} from './actions';
import * as constants from './constants';

import * as Redux from 'redux';
import {Experience, UserExperience, Tag} from 'src/interfaces/experience';
import {People} from 'src/interfaces/people';

export interface ExperienceState extends BasePaginationState {
  experiences: UserExperience[];
  allExperiences: Experience[];
  selectedExperience: Experience | null;
  searchExperience: Experience[];
  searchPeople: People[];
  searchTags: Tag[];
  hasMore: boolean;
  filter?: string;
  detail: Experience | null;
}

const initialState: ExperienceState = {
  loading: false,
  experiences: [],
  allExperiences: [],
  selectedExperience: null,
  searchExperience: [],
  searchPeople: [],
  searchTags: [],
  detail: null,
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
    case constants.FETCH_ALL_EXPERIENCES: {
      return {
        ...state,
        allExperiences: action.allExperiences,
        meta: action.meta,
      };
    }

    case constants.FETCH_EXPERIENCE: {
      if (!action.meta.currentPage || action.meta.currentPage === 1) {
        return {
          ...state,
          experiences: action.experiences,
          meta: action.meta,
        };
      } else {
        return {
          ...state,
          friends: [...state.experiences, ...action.experiences],
          meta: action.meta,
        };
      }
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
        experiences: action.experiences,
      };
    }

    case constants.SEARCH_ALL_RELATED_EXPERIENCES: {
      return {
        ...state,
        searchExperience: action.experiences,
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

    default: {
      return state;
    }
  }
};
