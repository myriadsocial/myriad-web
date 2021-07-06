import React, { createContext, useContext, useReducer } from 'react';

export enum WalletAddressActionType {
  INIT_WALLET_ADDRESS = 'INIT_WALLET_ADDRESS',
  INIT_SEND_TIPS = 'INIT_SEND_TIPS',
  SEND_TIPS_SUCCESS = 'SEND_TIPS_SUCCESS'
}

export interface InitWalletAddress {
  type: WalletAddressActionType.INIT_WALLET_ADDRESS;
  payload: string;
}

export interface InitSendTips {
  type: WalletAddressActionType.INIT_SEND_TIPS;
}

export interface SendTipsSuccess {
  type: WalletAddressActionType.SEND_TIPS_SUCCESS;
  amountSent: number;
  from: string;
  to: string;
  trxHash: string;
  success: boolean;
  tokenId: string;
}

export type Action = InitWalletAddress | InitSendTips | SendTipsSuccess;
type Dispatch = (action: Action) => void;
type WalletAddressProviderProps = { children: React.ReactNode };
type State = {
  init: boolean;
  walletAddress: string;
  amountSent: number;
  from: string;
  to: string;
  trxHash: string;
  success: boolean;
  tokenId: string;
};

const initialState = {
  init: true,
  walletAddress: '',
  amountSent: 0,
  from: '',
  to: '',
  trxHash: '',
  success: false,
  tokenId: ''
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

    case WalletAddressActionType.INIT_SEND_TIPS: {
      return {
        ...initialState,
        success: false
      };
    }

    case WalletAddressActionType.SEND_TIPS_SUCCESS: {
      return {
        ...state,
        amountSent: action.amountSent,
        from: action.from,
        to: action.to,
        trxHash: action.trxHash,
        success: true,
        tokenId: action.tokenId,
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
