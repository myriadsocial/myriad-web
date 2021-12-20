import * as BaseConstants from '../base/constants';
import {PaginationState as BasePaginationState} from '../base/state';
import {Actions} from './actions';
import * as constants from './constants';

import update from 'immutability-helper';
import * as Redux from 'redux';
import {Importer} from 'src/interfaces/user';

export interface ImporterState extends BasePaginationState {
  importers: Importer[];
  hasMore: boolean;
}

const initialState: ImporterState = {
  loading: true,
  importers: [],
  hasMore: false,
  meta: {
    currentPage: 1,
    itemsPerPage: 10,
    totalItemCount: 0,
    totalPageCount: 0,
  },
};

export const ImporterReducer: Redux.Reducer<ImporterState, Actions> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case constants.FETCH_IMPORTER: {
      if (!action.meta.currentPage || action.meta.currentPage === 1) {
        return {
          ...state,
          importers: action.importers,
          meta: action.meta,
        };
      }

      return {
        ...state,
        importers: [...state.importers, ...action.importers],
        meta: action.meta,
      };
    }

    case BaseConstants.ACTION_LOADING: {
      return update(state, {
        loading: {$set: action.loading},
      });
    }

    default: {
      return state;
    }
  }
};
