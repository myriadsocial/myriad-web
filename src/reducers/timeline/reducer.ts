import {HYDRATE} from 'next-redux-wrapper';

import {PaginationState as BasePaginationState} from '../base/state';
import {Actions} from './actions';
import * as constants from './constants';

import update from 'immutability-helper';
import * as Redux from 'redux';
import {Comment} from 'src/interfaces/comment';
import {SectionType} from 'src/interfaces/interaction';
import {Post} from 'src/interfaces/post';
import {TimelineType, TimelineOrderType, TimelineFilterFields} from 'src/interfaces/timeline';
import {WalletDetail} from 'src/interfaces/wallet';
import {SortType} from 'src/lib/api/interfaces/pagination-params.interface';

export interface TimelineFilters {
  fields?: TimelineFilterFields;
  query?: string;
  sort: SortType;
  order: TimelineOrderType;
}
export interface TimelineState extends BasePaginationState {
  type: TimelineType;
  posts: Post[];
  filters: TimelineFilters;
  walletDetails: WalletDetail[];
  post?: Post;
  interaction: {
    downvoting: Post | Comment | null;
  };
}

const initalState: TimelineState = {
  loading: true,
  type: TimelineType.TRENDING,
  filters: {
    fields: {tags: []},
    sort: 'DESC',
    order: TimelineOrderType.LATEST,
  },
  posts: [],
  walletDetails: [],
  meta: {
    currentPage: 1,
    itemsPerPage: 10,
    totalItemCount: 0,
    totalPageCount: 1,
  },
  interaction: {
    downvoting: null,
  },
};

export const TimelineReducer: Redux.Reducer<TimelineState, Actions> = (
  state = initalState,
  action,
) => {
  switch (action.type) {
    case HYDRATE: {
      return action.payload.timelineState;
    }

    case constants.LOAD_TIMELINE: {
      const {meta} = action.payload;

      return update(state, {
        type: {$set: action.payload.type ?? state.type},
        meta: {$set: meta},
        filters: {
          $set: {
            ...state.filters,
            ...action.payload.filters,
          },
        },
        posts: {
          $set:
            !meta.currentPage || meta.currentPage === 1
              ? action.payload.posts
              : [...state.posts, ...action.payload.posts],
        },
      });
    }

    case constants.ADD_POST_TO_TIMELINE: {
      return update(state, {
        posts: {$unshift: [action.post]},
      });
    }

    case constants.UPDATE_POST_PLATFORM_USER: {
      return {
        ...state,
        posts: state.posts.map(post => {
          if (post.user.id === action.userId) {
            post.user = {
              ...post.user,
              ...action.user,
            };
          }

          return post;
        }),
      };
    }

    case constants.UPDATE_TIMELINE_FILTER: {
      return update(state, {
        filters: {
          fields: {
            $set: {
              ...state.filters.fields,
              ...action.filter,
            },
          },
        },
      });
    }

    case constants.CLEAR_TIMELINE: {
      return update(state, {
        loading: {$set: true},
        posts: {$set: []},
        filters: {
          $set: {
            sort: 'DESC',
            order: TimelineOrderType.LATEST,
          },
        },
        meta: {
          $set: {
            currentPage: 1,
            itemsPerPage: 10,
            totalItemCount: 0,
            totalPageCount: 1,
          },
        },
      });
    }

    case constants.SET_DOWNVOTING: {
      return {
        ...state,
        interaction: {
          downvoting: action.reference,
        },
      };
    }

    case constants.RESET_DOWNVOTING: {
      return {
        ...state,
        interaction: {
          downvoting: null,
        },
      };
    }

    case constants.REMOVE_POST: {
      return {
        ...state,
        posts: state.posts.filter(post => {
          return post.id !== action.postId;
        }),
      };
    }

    case constants.FETCH_WALLET_DETAILS: {
      return {
        ...state,
        walletDetails: [...state.walletDetails, action.payload],
      };
    }

    case constants.FETCH_DEDICATED_POST: {
      return {
        ...state,
        post: action.post,
      };
    }

    case constants.UPVOTE_POST: {
      const post: Post | undefined = state.post;

      if (post && post.id === action.postId) {
        post.isUpvoted = true;
        post.isDownVoted = false;
        post.metric.upvotes = post.metric.upvotes + 1;

        // get previous downvote info
        const downvote = post.votes?.find(
          prevVote => !prevVote.state && prevVote.userId === action.vote.userId,
        );

        // if user has downvote, decrease count and replace with upvote
        if (post.votes && downvote) {
          post.metric.downvotes = post.metric.downvotes - 1;
          post.votes = [
            // get all votes not belong to current user
            ...post.votes.filter(prevVote => prevVote.userId !== action.vote.userId),
            // append upvote
            action.vote,
          ];
        } else {
          post.votes = post.votes ? [...post.votes, action.vote] : [action.vote];
        }
      }

      return {
        ...state,
        posts: state.posts.map(post => {
          if (post.id === action.postId) {
            post.isUpvoted = true;
            post.isDownVoted = false;
            post.metric.upvotes = post.metric.upvotes + 1;

            // get previous downvote info
            const downvote = post.votes?.find(
              prevVote => !prevVote.state && prevVote.userId === action.vote.userId,
            );

            // if user has downvote, decrease count and replace with upvote
            if (post.votes && downvote) {
              post.metric.downvotes = post.metric.downvotes - 1;
              post.votes = [
                // get all votes not belong to current user
                ...post.votes.filter(prevVote => prevVote.userId !== action.vote.userId),
                // append upvote
                action.vote,
              ];
            } else {
              post.votes = post.votes ? [...post.votes, action.vote] : [action.vote];
            }
          }

          return post;
        }),
        post,
      };
    }

    case constants.DOWNVOTE_POST: {
      const post: Post | undefined = state.post;

      if (post && post.id === action.postId) {
        post.isDownVoted = true;
        post.isUpvoted = false;
        post.metric.downvotes = post.metric.downvotes + 1;

        // get previous downvote info
        const upvote = post.votes?.find(
          prevVote => prevVote.state && prevVote.userId === action.vote.userId,
        );

        // if user has upvote, decrease count and replace with downvote
        if (post.votes && upvote) {
          post.metric.upvotes = post.metric.upvotes - 1;
          post.votes = [
            // get all votes not belong to current user
            ...post.votes.filter(prevVote => prevVote.userId !== action.vote.userId),
            // append downvote
            action.vote,
          ];
        } else {
          post.votes = post.votes ? [...post.votes, action.vote] : [action.vote];
        }
      }

      return {
        ...state,
        posts: state.posts.map(post => {
          if (post.id === action.postId) {
            post.isDownVoted = true;
            post.isUpvoted = false;
            post.metric.downvotes = post.metric.downvotes + 1;

            // get previous downvote info
            const upvote = post.votes?.find(
              prevVote => prevVote.state && prevVote.userId === action.vote.userId,
            );

            // if user has upvote, decrease count and replace with downvote
            if (post.votes && upvote) {
              post.metric.upvotes = post.metric.upvotes - 1;
              post.votes = [
                // get all votes not belong to current user
                ...post.votes.filter(prevVote => prevVote.userId !== action.vote.userId),
                // append downvote
                action.vote,
              ];
            } else {
              post.votes = post.votes ? [...post.votes, action.vote] : [action.vote];
            }
          }

          return post;
        }),
        post,
        interaction: {
          downvoting: null,
        },
      };
    }

    case constants.REMOVE_VOTE_POST: {
      const post: Post | undefined = state.post;

      if (post && post.id === action.postId) {
        if (post.isDownVoted) {
          post.metric.downvotes = post.metric.downvotes - 1;
        } else {
          post.metric.upvotes = post.metric.upvotes - 1;
        }

        post.isDownVoted = false;
        post.isUpvoted = false;
        post.votes = [];
      }

      return {
        ...state,
        posts: state.posts.map(post => {
          if (post.id === action.postId) {
            if (post.isDownVoted) {
              post.metric.downvotes = post.metric.downvotes - 1;
            } else {
              post.metric.upvotes = post.metric.upvotes - 1;
            }

            post.isDownVoted = false;
            post.isUpvoted = false;
            post.votes = [];
          }

          return post;
        }),
        post,
        interaction: {
          downvoting: null,
        },
      };
    }

    case constants.INCREASE_COMMENT_COUNT: {
      const post: Post | undefined = state.post;

      if (post && post.id === action.postId) {
        if (action.section === SectionType.DEBATE) {
          post.metric.debates += 1;
        } else {
          post.metric.discussions += 1;
        }

        post.metric.comments = post.metric.debates + post.metric.comments;
      }

      return {
        ...state,
        posts: state.posts.map(post => {
          if (post.id === action.postId) {
            if (action.section === SectionType.DEBATE) {
              post.metric.debates += 1;
            } else {
              post.metric.discussions += 1;
            }

            post.metric.comments = post.metric.debates + post.metric.comments;
          }

          return post;
        }),
        post,
      };
    }

    case constants.DECREASE_COMMENT_COUNT: {
      const post: Post | undefined = state.post;

      if (post && post.id === action.postId) {
        if (action.section === SectionType.DEBATE) {
          post.metric.debates -= 1;
        } else {
          post.metric.discussions -= 1;
        }
      }

      return {
        ...state,
        posts: state.posts.map(post => {
          if (post.id === action.postId) {
            if (action.section === SectionType.DEBATE) {
              post.metric.debates -= 1;
            } else {
              post.metric.discussions -= 1;
            }
          }

          return post;
        }),
        post,
      };
    }

    case constants.UPDATE_POST_METRIC: {
      const post: Post | undefined = state.post;

      if (post && post.id === action.postId) {
        post.metric = action.metric;
      }

      return {
        ...state,
        posts: state.posts.map(post => {
          if (post.id === action.postId) {
            post.metric = action.metric;
          }

          return post;
        }),
        post,
      };
    }

    case constants.UPDATE_POST_VISIBILITY: {
      return {
        ...state,
        posts: state.posts.map(post => {
          if (post.id === action.postId) {
            post.visibility = action.payload;
          }

          return post;
        }),
      };
    }

    case constants.SET_TIMELINE_SORT: {
      return update(state, {
        filters: {
          $set: {
            order: action.order,
            sort: action.sort ?? 'DESC',
          },
        },
      });
    }

    case constants.TIMELINE_LOADING: {
      return update(state, {
        loading: {$set: action.loading},
      });
    }

    default: {
      return state;
    }
  }
};
