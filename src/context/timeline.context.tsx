import React from 'react';

import { Post, Comment, PostSortMethod, PostFilter } from 'src/interfaces/post';

export enum TimelineActionType {
  LOAD_POST = 'LOAD_POST',
  LOAD_MORE_POST = 'LOAD_MORE_POST',
  LOAD_COMMENTS = 'LOAD_COMMENTS',
  ADD_COMMENT = 'ADD_COMMENT',
  SORT_POST = 'SORT_POST',
  CREATE_POST = 'CREATE_POST',
  UPDATE_FILTER = 'UPDATE_FILTER'
}

interface LoadPost {
  type: TimelineActionType.LOAD_POST;
  posts: Post[];
}

interface LoadMorePost {
  type: TimelineActionType.LOAD_MORE_POST;
}

interface LoadComments {
  type: TimelineActionType.LOAD_COMMENTS;
  postId: string;
  comments: Comment[];
}

interface AddComments {
  type: TimelineActionType.ADD_COMMENT;
  postId: string;
  comment: Comment;
}

interface SortPost {
  type: TimelineActionType.SORT_POST;
  sort: PostSortMethod;
}

interface UpdateFilter {
  type: TimelineActionType.UPDATE_FILTER;
  filter: PostFilter;
}

interface CreatePost {
  type: TimelineActionType.CREATE_POST;
  post: Post;
}

export type Action = LoadPost | LoadMorePost | LoadComments | AddComments | SortPost | UpdateFilter | CreatePost;

type Dispatch = (action: Action) => void;
type TimelineProviderProps = { children: React.ReactNode };
type State = {
  sort: PostSortMethod;
  page: number;
  filter: PostFilter;
  posts: Post[];
};

const initalState: State = {
  sort: 'created',
  page: 1,
  filter: {
    tags: [],
    people: [],
    layout: 'timeline',
    platform: []
  },
  posts: []
};

const TimelineContext = React.createContext<{ state: State; dispatch: Dispatch } | undefined>(undefined);

function timelineReducer(state: State, action: Action) {
  switch (action.type) {
    case TimelineActionType.LOAD_POST: {
      return {
        ...state,
        posts: state.page === 1 ? action.posts : [...state.posts, ...action.posts]
      };
    }
    case TimelineActionType.LOAD_MORE_POST: {
      return {
        ...state,
        page: state.page + 1
      };
    }
    case TimelineActionType.CREATE_POST: {
      return {
        ...state,
        posts: [action.post, ...state.posts]
      };
    }
    case TimelineActionType.SORT_POST: {
      return {
        ...state,
        sort: action.sort,
        page: 1
      };
    }
    case TimelineActionType.UPDATE_FILTER: {
      return {
        ...state,
        filter: action.filter,
        page: 1
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
