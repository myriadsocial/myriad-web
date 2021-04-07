import React from 'react';

export enum MyriadAccountActionType {
  ADD_ADDRESS = 'ADD_ADDRESS'
}

interface StoreAddress {
  type: MyriadAccountActionType.ADD_ADDRESS;
  address: string;
}

export type Action = StoreAddress;

type Dispatch = (action: Action) => void;
type MyriadAccountProviderProps = { children: React.ReactNode };

type State = {
  address: string;
};

const initialMyriadAccountState: State = {
  address: ''
};

const MyriadAccountContext = React.createContext<{ state: State; dispatch: Dispatch } | undefined>(undefined);

function myriadAccountReducer(state: State, action: Action): State {
  switch (action.type) {
    case MyriadAccountActionType.ADD_ADDRESS: {
      return {
        ...state,
        address: action.address
      };
    }
    default: {
      throw new Error('Unhandled action type on myriadAccountReducer');
    }
  }
}

export const useMyriadAccount = () => {
  const context = React.useContext(MyriadAccountContext);

  if (context === undefined) {
    throw new Error('useMyriadAccount must be used within a MyriadAccountProvider');
  }

  return context;
};

export const MyriadAccountProvider = ({ children }: MyriadAccountProviderProps) => {
  const [state, dispatch] = React.useReducer(myriadAccountReducer, initialMyriadAccountState);

  const value: any = { state, dispatch };

  return <MyriadAccountContext.Provider value={value}>{children}</MyriadAccountContext.Provider>;
};
