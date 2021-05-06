import React, { createContext, useContext, useReducer } from 'react';

export enum BalanceActionType {
  INIT_BALANCE = 'INIT_BALANCE'
}

export interface InitBalance {
  type: BalanceActionType.INIT_BALANCE;
  freeBalance: number;
}

export type Action = InitBalance;
type Dispatch = (action: Action) => void;
type BalanceProviderProps = { children: React.ReactNode };
type State = {
  init: boolean;
  freeBalance: number;
};

const initialState = {
  init: true,
  freeBalance: 0
};

const BalanceContext = createContext<{ state: State; dispatch: Dispatch } | undefined>(undefined);

function balanceReducer(state: State, action: Action) {
  switch (action.type) {
    case BalanceActionType.INIT_BALANCE: {
      return {
        ...state,
        freeBalance: action.freeBalance,
        init: false
      };
    }

    default: {
      throw new Error(`Unhandled action type on balanceReducer`);
    }
  }
}

export const useBalance = () => {
  const context = useContext(BalanceContext);

  if (context === undefined) {
    throw new Error('useBalance must be used within BalanceProvider');
  }

  return context;
};

export const BalanceProvider = ({ children }: BalanceProviderProps) => {
  const [state, dispatch] = useReducer(balanceReducer, initialState);
  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context
  const value = { state, dispatch };

  return <BalanceContext.Provider value={value}>{children}</BalanceContext.Provider>;
};
