import React from 'react';

import { ExtendedConversation } from 'src/interfaces/conversation';

export enum ConversationActionType {
  LOAD_CONVERSATION = 'LOAD_CONVERSATION'
}

interface LoadConversation {
  type: ConversationActionType.LOAD_CONVERSATION;
  payload: ExtendedConversation[];
}

type Action = LoadConversation;
type Dispatch = (action: Action) => void;
type ConversationProviderProps = { children: React.ReactNode };

type State = {
  conversations: ExtendedConversation[];
  viewed: ExtendedConversation | null;
};

const initalState = {
  conversations: [],
  viewed: null
};

const ConversationContext = React.createContext<{ state: State; dispatch: Dispatch } | undefined>(undefined);

function conversationReducer(state: State, action: Action) {
  switch (action.type) {
    case ConversationActionType.LOAD_CONVERSATION: {
      return {
        ...state,
        conversations: action.payload
      };
    }
    default: {
      throw new Error(`Unhandled action type`);
    }
  }
}

export const useConversation = () => {
  const context = React.useContext(ConversationContext);

  if (context === undefined) {
    throw new Error('useConversation must be used within a converstionProvider');
  }

  return context;
};

export const ConverstionProvider = ({ children }: ConversationProviderProps) => {
  const [state, dispatch] = React.useReducer(conversationReducer, initalState);
  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context
  const value = { state, dispatch };

  return <ConversationContext.Provider value={value}>{children}</ConversationContext.Provider>;
};
