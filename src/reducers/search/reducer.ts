import {HYDRATE} from 'next-redux-wrapper';

import {User} from '../../interfaces/user';
import {PaginationState as BasePaginationState} from '../base/state';
import {Actions} from './actions';
import * as constants from './constants';

import update from 'immutability-helper';
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

    case constants.CLEAR_USERS: {
      return {
        ...initialState,
      };
    }

    case constants.LOAD_USERS: {
      const {users, meta} = action.payload;

      return {
        ...state,
        searchedUsers:
          !meta.currentPage || meta.currentPage === 1 ? users : [...state.searchedUsers, ...users],
        isSearching: true,
        hasMore: meta.currentPage < meta.totalPageCount,
        meta,
      };
    }

    case constants.SEARCH_USERS: {
      const {meta} = action.payload;

      return {
        ...state,
        searchedUsers:
          !meta.currentPage || meta.currentPage === 1
            ? action.payload.users
            : [...state.searchedUsers, ...action.payload.users],
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

    case constants.USERS_LOADING: {
      return update(state, {
        loading: {$set: action.loading},
      });
    }

    case constants.SET_IS_SEARCHING: {
      return update(state, {
        isSearching: {$set: action.isSearching},
      });
    }

    default: {
      return state;
    }
  }
};
