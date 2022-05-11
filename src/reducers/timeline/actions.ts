import {Actions as BaseAction, setLoading, setError} from '../base/actions';
import {RootState} from '../index';
import {ShowToasterSnack, showToasterSnack} from '../toaster-snack/actions';
import * as constants from './constants';

import axios from 'axios';
import {Action} from 'redux';
import {Comment} from 'src/interfaces/comment';
import {FriendStatus} from 'src/interfaces/friend';
import {ReferenceType, SectionType, Vote} from 'src/interfaces/interaction';
import {Post, PostMetric, PostProps, PostVisibility} from 'src/interfaces/post';
import {TimelineFilter, TimelineOrderType, TimelineType} from 'src/interfaces/timeline';
import {UserProps} from 'src/interfaces/user';
import {WalletDetail} from 'src/interfaces/wallet';
import * as InteractionAPI from 'src/lib/api/interaction';
import {ListMeta} from 'src/lib/api/interfaces/base-list.interface';
import {SortType} from 'src/lib/api/interfaces/pagination-params.interface';
import * as PostAPI from 'src/lib/api/post';
import {ThunkActionCreator} from 'src/types/thunk';

/**
 * Action Types
 */

export interface LoadTimeline extends Action {
  type: constants.LOAD_TIMELINE;
  payload: {
    posts: Post[];
    sort?: SortType;
    filter?: TimelineFilter;
    type?: TimelineType;
    order?: TimelineOrderType;
    meta: ListMeta;
  };
}

export interface AddPostToTimeline extends Action {
  type: constants.ADD_POST_TO_TIMELINE;
  post: Post;
}

export interface RemovePost extends Action {
  type: constants.REMOVE_POST;
  postId: string;
}

export interface UpdateTimelineFilter extends Action {
  type: constants.UPDATE_TIMELINE_FILTER;
  filter: TimelineFilter;
}

export interface FetchWalletDetails extends Action {
  type: constants.FETCH_WALLET_DETAILS;
  payload: WalletDetail;
}

export interface ClearTimeline extends Action {
  type: constants.CLEAR_TIMELINE;
}

export interface FetchDedicatedPost extends Action {
  type: constants.FETCH_DEDICATED_POST;
  post: Post;
}

export interface UpdatePostPlatformUser extends Action {
  type: constants.UPDATE_POST_PLATFORM_USER;
  userId: string;
  user: Partial<UserProps>;
}

export interface UpvotePost extends Action {
  type: constants.UPVOTE_POST;
  postId: string;
  vote: Vote;
}

export interface SetDownvoting extends Action {
  type: constants.SET_DOWNVOTING;
  reference: Post | Comment | null;
}

export interface ResetDownvoting extends Action {
  type: constants.RESET_DOWNVOTING;
}

export interface DownvotePost extends Action {
  type: constants.DOWNVOTE_POST;
  postId: string;
  vote: Vote;
}

export interface RemoveVotePost extends Action {
  type: constants.REMOVE_VOTE_POST;
  postId: string;
  vote: Vote;
}

export interface IncreaseCommentCount extends Action {
  type: constants.INCREASE_COMMENT_COUNT;
  postId: string;
  section: SectionType;
}

export interface DecreaseCommentCount extends Action {
  type: constants.DECREASE_COMMENT_COUNT;
  postId: string;
  section: SectionType;
}

export interface UpdatePostMetric extends Action {
  type: constants.UPDATE_POST_METRIC;
  postId: string;
  metric: PostMetric;
}

export interface UpdatePostVisibility extends Action {
  type: constants.UPDATE_POST_VISIBILITY;
  postId: string;
  payload: PostVisibility;
}

export interface TimelineLoading extends Action {
  type: constants.TIMELINE_LOADING;
  loading: boolean;
}

export interface SetTimelineSort extends Action {
  type: constants.SET_TIMELINE_SORT;
  order: TimelineOrderType;
  sort?: SortType;
}

/**
 * Union Action Types
 */

export type Actions =
  | LoadTimeline
  | AddPostToTimeline
  | UpdateTimelineFilter
  | FetchWalletDetails
  | RemovePost
  | ClearTimeline
  | FetchDedicatedPost
  | UpdatePostPlatformUser
  | UpvotePost
  | SetDownvoting
  | DownvotePost
  | RemoveVotePost
  | IncreaseCommentCount
  | DecreaseCommentCount
  | UpdatePostMetric
  | ShowToasterSnack
  | UpdatePostVisibility
  | ResetDownvoting
  | TimelineLoading
  | SetTimelineSort
  | BaseAction;

export const updateFilter = (filter: TimelineFilter): UpdateTimelineFilter => ({
  type: constants.UPDATE_TIMELINE_FILTER,
  filter,
});

export const clearTimeline = (): ClearTimeline => ({
  type: constants.CLEAR_TIMELINE,
});

/**
 *
 * Actions
 */
export const setPost = (post: Post): FetchDedicatedPost => ({
  type: constants.FETCH_DEDICATED_POST,
  post,
});

export const setDownvoting = (reference: Post | Comment | null): SetDownvoting => ({
  type: constants.SET_DOWNVOTING,
  reference,
});

export const resetDownvoting = (): ResetDownvoting => ({
  type: constants.RESET_DOWNVOTING,
});

export const increaseCommentCount = (
  postId: string,
  section: SectionType,
): IncreaseCommentCount => ({
  type: constants.INCREASE_COMMENT_COUNT,
  postId,
  section,
});

export const decreaseCommentCount = (
  postId: string,
  section: SectionType,
): DecreaseCommentCount => ({
  type: constants.DECREASE_COMMENT_COUNT,
  postId,
  section,
});

export const updateMetric = (postId: string, metric: PostMetric): UpdatePostMetric => ({
  type: constants.UPDATE_POST_METRIC,
  postId,
  metric,
});

export const setTimelineSort = (order: TimelineOrderType, sort?: SortType): SetTimelineSort => ({
  type: constants.SET_TIMELINE_SORT,
  order,
  sort,
});

export const setTimelineLoading = (loading: boolean): TimelineLoading => ({
  type: constants.TIMELINE_LOADING,
  loading,
});

/**
 * Action Creator
 */
export const loadTimeline: ThunkActionCreator<Actions, RootState> =
  (
    page = 1,
    order?: TimelineOrderType,
    filter?: TimelineFilter,
    type?: TimelineType,
    sort?: SortType,
  ) =>
  async (dispatch, getState) => {
    dispatch(setTimelineLoading(true));
    let asFriend = false;

    const {
      profileState: {friendStatus},
      userState: {user},
    } = getState();

    try {
      const {timelineState, userState} = getState();
      const userId = userState.user?.id as string;
      const timelineType = type ?? timelineState.type;
      const timelineFilter = filter ?? timelineState.filter;
      const timelineSort = sort ?? timelineState.sort;
      const timelineOrder = order ?? timelineState.order;

      if (user && (timelineFilter?.owner || timelineFilter?.importer)) {
        asFriend = friendStatus?.status === FriendStatus.APPROVED;
      }

      const {data: posts, meta} = await PostAPI.getPost(
        page,
        userId,
        timelineType,
        timelineOrder,
        timelineFilter,
        asFriend,
        timelineSort,
      );

      dispatch({
        type: constants.LOAD_TIMELINE,
        payload: {
          posts: posts.map(post => {
            const upvoted = post.votes?.filter(vote => vote.userId === userId && vote.state);
            const downvoted = post.votes?.filter(vote => vote.userId === userId && !vote.state);

            post.isUpvoted = upvoted && upvoted.length > 0;
            post.isDownVoted = downvoted && downvoted.length > 0;

            return post;
          }),
          sort,
          filter: timelineFilter,
          type,
          meta,
          order,
        },
      });
    } catch (error) {
      dispatch(
        setError({
          message: error.message,
        }),
      );
    } finally {
      dispatch(setTimelineLoading(false));
    }
  };

export const createPost: ThunkActionCreator<Actions, RootState> =
  (post: PostProps, images: string[]) => async (dispatch, getState) => {
    const {
      userState: {user},
    } = getState();

    setLoading(true);

    try {
      if (!user) {
        throw new Error('User not found');
      }

      // TODO: simplify this
      const data = await PostAPI.createPost({
        ...post,
        createdBy: user.id,
        tags: post.tags || [],
      });

      dispatch({
        type: constants.ADD_POST_TO_TIMELINE,
        post: {
          ...data,
          user,
        },
      });

      dispatch(
        showToasterSnack({
          message: 'Post successfully created!',
          variant: 'success',
        }),
      );
    } catch (error) {
      dispatch(
        setError({
          message: 'Failed to create post, try again later',
        }),
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

export const importPost: ThunkActionCreator<Actions, RootState> =
  (
    postUrl: string,
    attributes: Pick<PostProps, 'NSFWTag' | 'visibility'>,
    callback?: (errorCode: number) => void,
  ) =>
  async (dispatch, getState) => {
    dispatch(setLoading(true));

    try {
      const {
        userState: {user},
      } = getState();

      if (!user) {
        throw new Error('User not found');
      }

      const post = await PostAPI.importPost({
        url: postUrl,
        importer: user.id,
        ...attributes,
      });

      // creator relation data
      post.user = user;

      dispatch({
        type: constants.ADD_POST_TO_TIMELINE,
        post,
      });

      dispatch(
        showToasterSnack({
          message: 'Post successfully imported!',
          variant: 'success',
        }),
      );
    } catch (error) {
      let message = error.message;
      if (
        axios.isAxiosError(error) &&
        (error.response?.status === 422 ||
          error.response?.status === 404 ||
          error.response?.status === 409)
      ) {
        message = error.response.data.error.message;
      }

      if (callback) {
        callback(error.response?.status);
      } else {
        dispatch(
          setError({
            message: message,
          }),
        );
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

export const updatePostPlatformUser: ThunkActionCreator<Actions, RootState> =
  (url: string) => async (dispatch, getState) => {
    const {
      userState: {user},
    } = getState();

    if (user) {
      const updatedProps: Partial<UserProps> = {
        profilePictureURL: url,
      };

      dispatch({
        type: constants.UPDATE_POST_PLATFORM_USER,
        userId: user.id,
        user: updatedProps,
      });
    }
  };

export const fetchWalletDetails: ThunkActionCreator<Actions, RootState> =
  (postId: string) => async dispatch => {
    dispatch(setLoading(true));
    try {
      const walletDetail = await PostAPI.getWalletAddress(postId);

      dispatch({
        type: constants.FETCH_WALLET_DETAILS,
        payload: walletDetail,
      });
    } catch (error) {
      dispatch(
        setError({
          message: error.message,
        }),
      );
    } finally {
      setLoading(false);
    }
  };

export const deletePost: ThunkActionCreator<Actions, RootState> =
  (postId: string, callback?: () => void) => async (dispatch, getState) => {
    dispatch(setLoading(true));

    try {
      const {
        userState: {user},
      } = getState();

      if (!user) {
        throw new Error('User not found');
      }

      await PostAPI.removePost(postId);

      dispatch({
        type: constants.REMOVE_POST,
        postId,
      });

      callback && callback();
    } catch (error) {
      dispatch(
        setError({
          message: error.message,
        }),
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

export const editPost: ThunkActionCreator<Actions, RootState> =
  (postId: string, payload: Partial<Post>, callback?: () => void) => async (dispatch, getState) => {
    dispatch(setLoading(true));

    try {
      const visibility = payload.visibility as PostVisibility;
      const {
        userState: {user},
      } = getState();

      if (!user) {
        throw new Error('User not found');
      }

      await PostAPI.editPost(postId, payload);

      dispatch({
        type: constants.UPDATE_POST_VISIBILITY,
        postId,
        payload: visibility,
      });

      callback && callback();
    } catch (error) {
      dispatch(
        setError({
          message: error.message,
        }),
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

export const getDedicatedPost: ThunkActionCreator<Actions, RootState> =
  (postId: string) => async (dispatch, getState) => {
    dispatch(setLoading(true));

    try {
      const {
        userState: {user},
      } = getState();

      const post = await PostAPI.getPostDetail(postId, user?.id);

      dispatch(setPost(post));
    } catch (error) {
      dispatch(
        setError({
          message: error.message,
        }),
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

export const upvote: ThunkActionCreator<Actions, RootState> =
  (reference: Post | Comment, section?: SectionType, callback?: (vote: Vote) => void) =>
  async (dispatch, getState) => {
    dispatch(setLoading(true));

    try {
      const {
        userState: {user},
      } = getState();

      if (!user) {
        throw new Error('User not found');
      }

      const vote = await InteractionAPI.vote(user.id, reference, section);

      if ('platform' in reference) {
        dispatch({
          type: constants.UPVOTE_POST,
          postId: reference.id,
          vote,
        });
      }

      callback && callback(vote);
    } catch (error) {
      dispatch(
        setError({
          message: error.message,
        }),
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

export const downvote: ThunkActionCreator<Actions, RootState> =
  (reference: Post | Comment, section?: SectionType, callback?: (vote: Vote) => void) =>
  async (dispatch, getState) => {
    dispatch(setLoading(true));

    try {
      const {
        userState: {user},
      } = getState();

      if (!user) {
        throw new Error('User not found');
      }

      const vote = await InteractionAPI.downvote(user.id, reference, section);

      if ('platform' in reference) {
        dispatch({
          type: constants.DOWNVOTE_POST,
          postId: reference.id,
          vote,
        });
      }

      dispatch(resetDownvoting());

      callback && callback(vote);
    } catch (error) {
      dispatch(
        setError({
          message: error.message,
        }),
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

export const removeVote: ThunkActionCreator<Actions, RootState> =
  (reference: Post | Comment, callback?: () => void) => async (dispatch, getState) => {
    dispatch(setLoading(true));

    try {
      const {
        userState: {user},
      } = getState();

      if (!user) {
        throw new Error('User not found');
      }

      if (!reference.votes) {
        return;
      }

      for (const vote of reference.votes) {
        await InteractionAPI.removeVote(vote.id);

        if (vote.type === ReferenceType.POST) {
          dispatch({
            type: constants.REMOVE_VOTE_POST,
            postId: vote.referenceId,
            vote,
          });
        }
      }

      callback && callback();
    } catch (error) {
      dispatch(
        setError({
          message: error.message,
        }),
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

export const fetchSearchedPosts: ThunkActionCreator<Actions, RootState> =
  (query: string, page = 1) =>
  async (dispatch, getState) => {
    dispatch(setTimelineLoading(true));

    const {
      userState: {user},
      timelineState: {order, sort},
    } = getState();

    const userId = user?.id as string;

    try {
      const filter = {userId: user?.id, query};
      const {data: posts, meta} = await PostAPI.findPosts(filter, {page, orderField: order, sort});

      dispatch({
        type: constants.LOAD_TIMELINE,
        payload: {
          posts: posts.map(post => {
            const upvoted = post.votes?.filter(vote => vote.userId === userId && vote.state);
            const downvoted = post.votes?.filter(vote => vote.userId === userId && !vote.state);

            post.isUpvoted = upvoted && upvoted.length > 0;
            post.isDownVoted = downvoted && downvoted.length > 0;

            return post;
          }),
          meta,
        },
      });
    } catch (error) {
      dispatch(
        setError({
          message: error.message,
        }),
      );
    } finally {
      dispatch(setTimelineLoading(false));
    }
  };

export const updatePostMetric: ThunkActionCreator<Actions, RootState> =
  (postId: string) => async (dispatch, getState) => {
    try {
      const {
        userState: {user},
      } = getState();

      const post = await PostAPI.getPostDetail(postId, user?.id);

      dispatch(updateMetric(postId, post.metric));
    } catch (error) {
      dispatch(
        setError({
          message: error.message,
        }),
      );
    }
  };
