import React from 'react';

import { Post, Comment } from 'src/interfaces/post';

export enum TimelineActionType {
  INIT_POST = 'INIT_POST',
  LOAD_MORE_POST = 'LOAD_MORE_POST',
  LOAD_COMMENTS = 'LOAD_COMMENTS',
  ADD_COMMENT = 'ADD_COMMENT'
}

interface InitPost {
  type: TimelineActionType.INIT_POST;
  posts: Post[];
}

interface LoadMorePost {
  type: TimelineActionType.LOAD_MORE_POST;
  posts: Post[];
}

interface loadComments {
  type: TimelineActionType.LOAD_COMMENTS;
  postId: string;
  comments: Comment[];
}

interface addComments {
  type: TimelineActionType.ADD_COMMENT;
  postId: string;
  comment: Comment;
}

export type Action = InitPost | LoadMorePost | loadComments | addComments;

type Dispatch = (action: Action) => void;
type TimelineProviderProps = { children: React.ReactNode };
type State = {
  posts: Post[];
};

const initalState = {
  posts: []
};

const TimelineContext = React.createContext<{ state: State; dispatch: Dispatch } | undefined>(undefined);

function timelineReducer(state: State, action: Action) {
  switch (action.type) {
    case TimelineActionType.INIT_POST: {
      return {
        ...state,
        posts: action.posts
      };
    }
    case TimelineActionType.LOAD_MORE_POST: {
      return {
        ...state,
        posts: [...state.posts, ...action.posts]
      };
    }
    case TimelineActionType.LOAD_COMMENTS: {
      return {
        ...state,
        posts: state.posts.map(post => {
          if (post.id === action.postId) {
            post.comments = action.comments;
          }
          return post;
        })
      };
    }

    case TimelineActionType.ADD_COMMENT: {
      return {
        ...state,
        posts: state.posts.map(post => {
          if (post.id === action.postId) {
            post.comments.push(action.comment);
          }
          return post;
        })
      };
    }
    default: {
      throw new Error(`Unhandled action type`);
    }
  }
}

export const useTimeline = () => {
  const context = React.useContext(TimelineContext);

  if (context === undefined) {
    throw new Error('useTimeline must be used within a TimelineProvider');
  }

  return context;
};

export const TimelineProvider = ({ children }: TimelineProviderProps) => {
  const [state, dispatch] = React.useReducer(timelineReducer, initalState);
  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context
  const value = { state, dispatch };

  return <TimelineContext.Provider value={value}>{children}</TimelineContext.Provider>;
};
