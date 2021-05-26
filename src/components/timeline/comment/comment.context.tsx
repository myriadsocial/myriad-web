import React from 'react';

import { Post, Comment } from 'src/interfaces/post';

export enum CommentActionType {
  LOAD_COMMENTS = 'LOAD_COMMENTS',
  LOAD_MORE_COMMENT = 'LOAD_MORE_COMMENT',
  REPLY_COMMENT = 'REPLY_COMMENT'
}

interface LoadComments {
  type: CommentActionType.LOAD_COMMENTS;
  payload: {
    post: Post;
    comments: Comment[];
  };
}

interface LoadMoreComments {
  type: CommentActionType.LOAD_MORE_COMMENT;
  payload: Comment[];
}

interface ReplyComment {
  type: CommentActionType.REPLY_COMMENT;
  payload: Comment;
}

type Action = LoadComments | LoadMoreComments | ReplyComment;
type Dispatch = (action: Action) => void;
type CommentProviderProps = { children: React.ReactNode };

type State = {
  loading: boolean;
  post: Post | null;
  comments: Comment[];
  debates: Comment[];
  meta: {
    page: number;
  };
};

const initalState: State = {
  loading: false,
  post: null,
  comments: [],
  debates: [],
  meta: {
    page: 1
  }
};

const CommentContext = React.createContext<{ state: State; dispatch: Dispatch } | undefined>(undefined);

function commentReducer(state: State, action: Action) {
  switch (action.type) {
    case CommentActionType.LOAD_COMMENTS: {
      return {
        ...state,
        post: action.payload.post,
        comments: action.payload.comments,
        loading: false
      };
    }

    case CommentActionType.LOAD_MORE_COMMENT: {
      return {
        ...state,
        comments: [...state.comments, ...action.payload],
        meta: {
          page: state.meta.page + 1
        }
      };
    }

    case CommentActionType.REPLY_COMMENT: {
      return {
        ...state,
        comments: [...state.comments, action.payload]
      };
    }
    default: {
      throw new Error(`Unhandled action type`);
    }
  }
}

export const useComments = () => {
  const context = React.useContext(CommentContext);

  if (context === undefined) {
    throw new Error('useComments must be used within a CommentProvider');
  }

  return context;
};

export const CommentProvider = ({ children }: CommentProviderProps) => {
  const [state, dispatch] = React.useReducer(commentReducer, initalState);
  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context
  const value = { state, dispatch };

  return <CommentContext.Provider value={value}>{children}</CommentContext.Provider>;
};
