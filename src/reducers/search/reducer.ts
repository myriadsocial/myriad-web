import {HYDRATE} from 'next-redux-wrapper';

import {User} from '../../interfaces/user';
import {PaginationState as BasePaginationState} from '../base/state';
import {Actions} from './actions';
import * as constants from './constants';

import * as Redux from 'redux';

export interface SearchState extends BasePaginationState {
  isSearching: boolean;
  searchedUsers: User[];
  hasMore: boolean;
}

const initialState: SearchState = {
  loading: false,
  isSearching: false,
  searchedUsers: [],
  hasMore: false,
  meta: {
    currentPage: 1,
    itemsPerPage: 10,
    totalItemCount: 0,
    totalPageCount: 0,
  },
};

export const SearchReducer: Redux.Reducer<SearchState, Actions> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case HYDRATE: {
      return action.payload.searchState;
    }

    case constants.RESET_SEARCH_STATE: {
      return {
        ...initialState,
      };
    }

    case constants.SEARCH_USERS: {
      const {meta} = action;

      return {
        ...state,
        searchedUsers:
          !meta.currentPage || meta.currentPage === 1
            ? action.users
            : [...state.searchedUsers, ...action.users],
        isSearching: true,
        hasMore: meta.currentPage < meta.totalPageCount,
        meta,
      };
    }

    case constants.ABORT_SEARCH: {
      return {
        ...state,
        isSearching: false,
      };
    }

    default: {
      return state;
    }
  }
};
