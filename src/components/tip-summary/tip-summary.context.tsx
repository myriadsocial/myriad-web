import React from 'react';

import { Post } from 'src/interfaces/post';

export enum TipSummaryActionType {
  SET_TIPPED_POST = 'SET_CURRENT_TIPPED_POST',
  CLEAR_TIPPED_POST = 'CLEAR_TIPPED_POST'
}

interface SetTippedPost {
  type: TipSummaryActionType.SET_TIPPED_POST;
  payload: Post;
}

interface ClearTippedPost {
  type: TipSummaryActionType.CLEAR_TIPPED_POST;
}

type Action = SetTippedPost | ClearTippedPost;
type Dispatch = (action: Action) => void;
type TipSummaryProviderProps = { children: React.ReactNode };

type State = {
  post: Post | null;
};

const initalState: State = {
  post: null
};

const TipSummaryContext = React.createContext<{ state: State; dispatch: Dispatch } | undefined>(undefined);

function tipSummaryReducer(state: State, action: Action) {
  switch (action.type) {
    case TipSummaryActionType.SET_TIPPED_POST: {
      return {
        ...state,
        post: action.payload
      };
    }

    case TipSummaryActionType.CLEAR_TIPPED_POST: {
      return initalState;
    }

    default: {
      throw new Error(`Unhandled action type`);
    }
  }
}

export const useTipSummary = () => {
  const context = React.useContext(TipSummaryContext);

  if (context === undefined) {
    throw new Error('useTipSummary must be used within a TipSummaryProvider');
  }

  return context;
};

export const TipSummaryProvider = ({ children }: TipSummaryProviderProps) => {
  const [state, dispatch] = React.useReducer(tipSummaryReducer, initalState);
  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context
  const value = { state, dispatch };

  return <TipSummaryContext.Provider value={value}>{children}</TipSummaryContext.Provider>;
};
