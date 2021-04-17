import React from 'react';

type Action = { type: 'ADD_ADDRESS'; key: string; value: string } | { type: 'STORE_BALANCE'; key: string; value: number };
type Dispatch = (action: Action) => void;
type MyriadAccountProviderProps = { children: React.ReactNode };

type State = {
  address: string;
  freeBalance: number;
};

const initialMyriadAccountState: State = {
  address: '',
  freeBalance: 0
};

const MyriadAccountContext = React.createContext<{ state: State; dispatch: Dispatch } | undefined>(undefined);

function myriadAccountReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_ADDRESS': {
      return {
        ...state,
        [action.key]: action.value
      };
    }
    case 'STORE_BALANCE': {
      return {
        ...state,
        [action.key]: action.value
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
