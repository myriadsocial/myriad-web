import React from 'react';

import {ExtendedConversation} from 'src/interfaces/conversation';
import {Comment, Post} from 'src/interfaces/post';

export enum ConversationActionType {
  LOAD_CONVERSATION = 'LOAD_CONVERSATION',
  LOAD_CONVERSATION_DETAIL = 'LOAD_CONVERSATION_DETAIL',
  REPLY_CONVERSATION = 'REPLY_CONVERSATION',
  LOAD_REPLY = 'LOAD_REPLY',
}

interface LoadConversation {
  type: ConversationActionType.LOAD_CONVERSATION;
  payload: ExtendedConversation[];
}

interface LoadConversationDetail {
  type: ConversationActionType.LOAD_CONVERSATION_DETAIL;
  payload: Post;
}

interface ReplyConversation {
  type: ConversationActionType.REPLY_CONVERSATION;
  payload: Comment;
}

interface LoadReply {
  type: ConversationActionType.LOAD_REPLY;
  payload: Comment[];
}

type Action = LoadConversation | LoadConversationDetail | LoadReply | ReplyConversation;
type Dispatch = (action: Action) => void;
type ConversationProviderProps = {children: React.ReactNode};

type State = {
  conversations: ExtendedConversation[];
  viewed: Post | null;
};

const initalState = {
  conversations: [],
  viewed: null,
};

const ConversationContext = React.createContext<{state: State; dispatch: Dispatch} | undefined>(
  undefined,
);

function conversationReducer(state: State, action: Action) {
  switch (action.type) {
    case ConversationActionType.LOAD_CONVERSATION: {
      return {
        ...state,
        conversations: action.payload,
      };
    }

    case ConversationActionType.LOAD_CONVERSATION_DETAIL: {
      return {
        ...state,
        viewed: action.payload,
      };
    }

    case ConversationActionType.REPLY_CONVERSATION: {
      if (!state.viewed) return state;

      return {
        ...state,
        viewed: {
          ...state.viewed,
          comments: [...state.viewed.comments, action.payload],
        },
      };
    }
    case ConversationActionType.LOAD_REPLY: {
      if (!state.viewed) return state;

      return {
        ...state,
        viewed: {
          ...state.viewed,
          comments: [...state.viewed.comments, ...action.payload],
        },
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

export const ConverstionProvider = ({children}: ConversationProviderProps) => {
  const [state, dispatch] = React.useReducer(conversationReducer, initalState);
  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context
  const value = {state, dispatch};

  return <ConversationContext.Provider value={value}>{children}</ConversationContext.Provider>;
};
