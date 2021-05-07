import React, { createContext, useContext, useReducer } from 'react';

export enum WalletAddressActionType {
  INIT_WALLET_ADDRESS = 'INIT_WALLET_ADDRESS'
}

export interface InitWalletAddress {
  type: WalletAddressActionType.INIT_WALLET_ADDRESS;
  payload: string;
}

export type Action = InitWalletAddress;
type Dispatch = (action: Action) => void;
type WalletAddressProviderProps = { children: React.ReactNode };
type State = {
  init: boolean;
  walletAddress: string;
};

const initialState = {
  init: true,
  walletAddress: ''
};

const WalletAddressContext = createContext<{ state: State; dispatch: Dispatch } | undefined>(undefined);

function walletAddressReducer(state: State, action: Action) {
  switch (action.type) {
    case WalletAddressActionType.INIT_WALLET_ADDRESS: {
      return {
        ...state,
        walletAddress: action.payload,
        init: false
      };
    }

    default: {
      throw new Error(`Unhandled action type on walletAddressReducer`);
    }
  }
}

export const useWalletAddress = () => {
  const context = useContext(WalletAddressContext);

  if (context === undefined) {
    throw new Error('useWalletAddress must be used within WalletAddressContext');
  }

  return context;
};

export const WalletAddressProvider = ({ children }: WalletAddressProviderProps) => {
  const [state, dispatch] = useReducer(walletAddressReducer, initialState);
  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context
  const value = { state, dispatch };

  return <WalletAddressContext.Provider value={value}>{children}</WalletAddressContext.Provider>;
};
