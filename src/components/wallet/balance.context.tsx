import React, { createContext, useContext, useReducer } from 'react';

import { BalanceDetail } from 'src/interfaces/balance';

export enum BalanceActionType {
  INIT_BALANCE = 'INIT_BALANCE'
}

type State = {
  init: boolean;
  balanceDetails: BalanceDetail[];
};

export interface InitBalance {
  type: BalanceActionType.INIT_BALANCE;
  balanceDetails: BalanceDetail[];
}

export type Action = InitBalance;
type Dispatch = (action: Action) => void;
type BalanceProviderProps = { children: React.ReactNode };

const initialState = {
  init: true,
  balanceDetails: []
};

const BalanceContext = createContext<{ state: State; dispatch: Dispatch } | undefined>(undefined);

function balanceReducer(state: State, action: Action) {
  switch (action.type) {
    case BalanceActionType.INIT_BALANCE: {
      return {
        ...state,
        balanceDetails: action.balanceDetails,
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
