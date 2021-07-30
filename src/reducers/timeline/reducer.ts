import {State as BaseState} from '../base/state';
import {Actions} from './actions';
import * as constants from './constants';

import update from 'immutability-helper';
import * as Redux from 'redux';
import {Post} from 'src/interfaces/post';
import {TimelineType, TimelineSortMethod, TimelineFilter} from 'src/interfaces/timeline';
import {WalletDetail} from 'src/interfaces/wallet';

export interface TimelineState extends BaseState {
  type: TimelineType;
  sort: TimelineSortMethod;
  filter?: TimelineFilter;
  hasMore: boolean;
  page: number;
  posts: Post[];
  walletDetails: WalletDetail[];
}

const initalState: TimelineState = {
  loading: false,
  page: 1,
  type: TimelineType.DEFAULT,
  sort: 'created',
  hasMore: true,
  posts: [],
  walletDetails: [],
};

export const TimelineReducer: Redux.Reducer<TimelineState, Actions> = (
  state = initalState,
  action,
) => {
  switch (action.type) {
    case constants.LOAD_TIMELINE: {
      return {
        ...state,
        posts: action.meta.page === 1 ? action.posts : [...state.posts, ...action.posts],
        page: action.meta.page,
        type: action.meta.type ?? state.type,
        sort: action.meta.sort ?? state.sort,
        filter: action.meta.filter ?? state.filter,
        hasMore: action.meta.hasMore,
      };
    }

    case constants.ADD_POST_TO_TIMELINE: {
      return update(state, {
        posts: {$unshift: [action.post]},
      });
    }

    case constants.LIKE_POST: {
      return {
        ...state,
        posts: state.posts.map(post => {
          if (post.id === action.postId && post.publicMetric) {
            post.publicMetric.liked += 1;
          }

          return post;
        }),
      };
    }

    case constants.UNLIKE_POST: {
      return {
        ...state,
        posts: state.posts.map(post => {
          if (post.id === action.postId && post.publicMetric) {
            post.publicMetric.liked -= 1;
          }

          return post;
        }),
      };
    }

    case constants.DISLIKE_POST: {
      return {
        ...state,
        posts: state.posts.map(post => {
          if (post.id === action.postId && post.publicMetric) {
            post.publicMetric.disliked += 1;
          }

          return post;
        }),
      };
    }

    case constants.UNDISLIKE_POST: {
      return {
        ...state,
        posts: state.posts.map(post => {
          if (post.id === action.postId && post.publicMetric) {
            post.publicMetric.disliked -= 1;
          }

          return post;
        }),
      };
    }

    case constants.FETCH_WALLET_DETAILS: {
      return {
        ...state,
        walletDetails: [...state.walletDetails, action.payload],
      };
    }

    default: {
      return state;
    }
  }
};
