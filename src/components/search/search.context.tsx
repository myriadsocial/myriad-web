import React, {createContext, useContext, useReducer} from 'react';

import {User} from 'src/interfaces/user';

export enum SearchActionType {
  RESET_STATE = 'RESET_STATE',
  LOAD_USER = 'USER_LOADED',
  ABORT_SEARCH = 'ABORT_SEARCH',
}

export interface ResetState {
  type: SearchActionType.RESET_STATE;
}

export interface LoadUser {
  type: SearchActionType.LOAD_USER;
  payload: User[];
}

export interface AbortSearch {
  type: SearchActionType.ABORT_SEARCH;
}

export type Action = LoadUser | AbortSearch | ResetState;
type Dispatch = (action: Action) => void;
type SearchProviderProps = {children: React.ReactNode};
type State = {
  users: User[];
  isSearching: boolean;
};

const initialState = {
  isSearching: false,
  users: [],
};

const SearchContext = createContext<{state: State; dispatch: Dispatch} | undefined>(undefined);

function searchReducer(state: State, action: Action) {
  switch (action.type) {
    case SearchActionType.RESET_STATE: {
      return {
        ...initialState,
      };
    }
    case SearchActionType.LOAD_USER: {
      return {
        ...state,
        users: action.payload,
        isSearching: true,
      };
    }
    case SearchActionType.ABORT_SEARCH: {
      return {
        ...state,
        isSearching: false,
      };
    }
    default: {
      throw new Error(`Unhandled action type on searchReducer`);
    }
  }
}

export const useSearch = () => {
  const context = useContext(SearchContext);

  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }

  return context;
};

export const SearchProvider = ({children}: SearchProviderProps) => {
  const [state, dispatch] = useReducer(searchReducer, initialState);
  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context
  const value = {state, dispatch};

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
};
