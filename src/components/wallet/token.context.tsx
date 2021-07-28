import React, {createContext, useContext, useReducer} from 'react';

import {Token} from 'src/interfaces/token';

export enum TokenActionType {
  INIT_TOKEN = 'INIT_TOKEN',
  INIT_USER_TOKEN = 'INIT_USER_TOKEN',
  ADD_TOKEN = 'ADD_TOKEN',
}

export interface InitToken {
  type: TokenActionType.INIT_TOKEN;
  payload: Token[];
}

export interface InitUserToken {
  type: TokenActionType.INIT_USER_TOKEN;
  payload: Token[];
}

export interface AddToken {
  type: TokenActionType.ADD_TOKEN;
  payload: Token[];
}

export type Action = InitToken | InitUserToken | AddToken;
type Dispatch = (action: Action) => void;
type TokenProviderProps = {children: React.ReactNode};
type State = {
  init: boolean;
  tokens: Token[];
  userTokens: Token[];
};

const initialState = {
  init: true,
  tokens: [],
  userTokens: [],
};

const TokenContext = createContext<{state: State; dispatch: Dispatch} | undefined>(undefined);

function tokenReducer(state: State, action: Action) {
  switch (action.type) {
    case TokenActionType.INIT_TOKEN: {
      return {
        ...state,
        tokens: action.payload,
        init: false,
      };
    }

    case TokenActionType.INIT_USER_TOKEN: {
      return {
        ...state,
        userTokens: action.payload,
      };
    }

    case TokenActionType.ADD_TOKEN: {
      return {
        ...state,
        userTokens: action.payload,
      };
    }

    default: {
      throw new Error(`Unhandled action type on tokenReducer`);
    }
  }
}

export const useToken = () => {
  const context = useContext(TokenContext);

  if (context === undefined) {
    throw new Error('useToken must be used within TokenProvider');
  }

  return context;
};

export const TokenProvider = ({children}: TokenProviderProps) => {
  const [state, dispatch] = useReducer(tokenReducer, initialState);
  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context
  const value = {state, dispatch};

  return <TokenContext.Provider value={value}>{children}</TokenContext.Provider>;
};
