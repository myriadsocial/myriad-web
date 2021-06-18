import React, { createContext, useContext, useReducer } from 'react';

export enum WalletAddressActionType {
  INIT_WALLET_ADDRESS = 'INIT_WALLET_ADDRESS',
  SEND_TIPS = 'SEND_TIPS'
}

export interface InitWalletAddress {
  type: WalletAddressActionType.INIT_WALLET_ADDRESS;
  payload: string;
}

//TODO: add new state to contain all the transactions made during user session
export interface SendTips {
  type: WalletAddressActionType.SEND_TIPS;
  amount: number;
  from: string;
  to: string;
  trxHash: string;
}

export type Action = InitWalletAddress | SendTips;
type Dispatch = (action: Action) => void;
type WalletAddressProviderProps = { children: React.ReactNode };
type State = {
  init: boolean;
  walletAddress: string;
  amountSent: number;
};

const initialState = {
  init: true,
  walletAddress: '',
  amountSent: 0
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

    case WalletAddressActionType.SEND_TIPS: {
      return {
        ...state,
        amountSent: action.amount,
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
