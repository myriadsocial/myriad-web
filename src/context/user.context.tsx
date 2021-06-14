import React from 'react';

import { ExtendedUser } from 'src/interfaces/user';

export enum UserActionType {
  FETCH_USER = 'FETCH_USER',
  SET_ANONYMOUS = 'SET_ANONYMOUS',
  USER_LOADED = 'USER_LOADED'
}

interface UserLoaded {
  type: UserActionType.USER_LOADED;
  payload: ExtendedUser;
}

interface SetAsAnonymous {
  type: UserActionType.SET_ANONYMOUS;
}

interface FetchUser {
  type: UserActionType.FETCH_USER;
}

type Action = UserLoaded | FetchUser | SetAsAnonymous;
type Dispatch = (action: Action) => void;
type UserProviderProps = { children: React.ReactNode };

type State = {
  user: ExtendedUser | null;
  anonymous: boolean;
  loading: boolean;
};

const initalState = {
  loading: false,
  anonymous: false,
  user: null
};

const UserContext = React.createContext<{ state: State; dispatch: Dispatch } | undefined>(undefined);

function userReducer(state: State, action: Action) {
  switch (action.type) {
    case UserActionType.USER_LOADED: {
      return {
        ...state,
        user: action.payload,
        loading: false
      };
    }
    case UserActionType.FETCH_USER: {
      return {
        ...state,
        loading: true
      };
    }
    case UserActionType.SET_ANONYMOUS: {
      return {
        ...state,
        loading: false,
        anonymous: true
      };
    }
    default: {
      throw new Error(`Unhandled action type`);
    }
  }
}

export const useUser = () => {
  const context = React.useContext(UserContext);

  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
};

export const UserProvider = ({ children }: UserProviderProps) => {
  const [state, dispatch] = React.useReducer(userReducer, initalState);
  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context
  const value = { state, dispatch };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
