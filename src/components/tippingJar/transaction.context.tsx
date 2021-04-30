import React, { createContext, useContext, useReducer } from 'react';

import { Transaction } from 'src/interfaces/transaction';

export enum TransactionActionType {
  INIT_TRANSACTION = 'INIT_TRANSACTION'
}

export interface InitTransaction {
  type: TransactionActionType.INIT_TRANSACTION;
  transactions: Transaction[];
}

export type Action = InitTransaction;
type Dispatch = (action: Action) => void;
type TransactionProviderProps = { children: React.ReactNode };
type State = {
  init: boolean;
  transactions: Transaction[];
};

const initialState = {
  init: true,
  transactions: []
};

const TransactionContext = createContext<{ state: State; dispatch: Dispatch } | undefined>(undefined);

function transactionReducer(state: State, action: Action) {
  switch (action.type) {
    case TransactionActionType.INIT_TRANSACTION: {
      return {
        ...state,
        transactions: action.transactions,
        init: false
      };
    }

    default: {
      throw new Error(`Unhandled action type on transactionReducer`);
    }
  }
}

export const useTransaction = () => {
  const context = useContext(TransactionContext);

  if (context === undefined) {
    throw new Error('useTransaction must be used within TransactionProvider');
  }

  return context;
};

export const TransactionProvider = ({ children }: TransactionProviderProps) => {
  const [state, dispatch] = useReducer(transactionReducer, initialState);
  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context
  const value = { state, dispatch };

  return <TransactionContext.Provider value={value}>{children}</TransactionContext.Provider>;
};
