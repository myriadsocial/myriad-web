import {Actions as BaseAction, setLoading, setError} from '../base/actions';
import {RootState} from '../index';
import * as constants from './constants';

import {Action} from 'redux';
import {generateImageSizes} from 'src/helpers/cloudinary';
import {Post} from 'src/interfaces/post';
import {TimelineFilter, TimelineSortMethod, TimelineType} from 'src/interfaces/timeline';
import {WalletDetail, ContentType} from 'src/interfaces/wallet';
import * as PostAPI from 'src/lib/api/post';
import * as UserAPI from 'src/lib/api/user';
import * as WalletAddressAPI from 'src/lib/api/wallet';
import {ThunkActionCreator} from 'src/types/thunk';

/**
 * Action Types
 */

export interface LoadTimeline extends Action {
  type: constants.LOAD_TIMELINE;
  posts: Post[];
  meta: {
    page: number;
    hasMore: boolean;
    sort?: TimelineSortMethod;
    filter?: TimelineFilter;
    type?: TimelineType;
  };
}

export interface AddPostToTimeline extends Action {
  type: constants.ADD_POST_TO_TIMELINE;
  post: Post;
}

export interface LikePost extends Action {
  type: constants.LIKE_POST;
  postId: string;
}

export interface UnLikePost extends Action {
  type: constants.UNLIKE_POST;
  postId: string;
}

export interface DislikePost extends Action {
  type: constants.DISLIKE_POST;
  postId: string;
}

export interface UnDislikePost extends Action {
  type: constants.UNDISLIKE_POST;
  postId: string;
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

/**
 * Union Action Types
 */

export type Actions =
  | LoadTimeline
  | AddPostToTimeline
  | UpdateTimelineFilter
  | LikePost
  | DislikePost
  | UnLikePost
  | UnDislikePost
  | FetchWalletDetails
  | RemovePost
  | ClearTimeline
  | FetchDedicatedPost
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

/**
 * Action Creator
 */
export const loadTimeline: ThunkActionCreator<Actions, RootState> =
  (page = 1, sort?: TimelineSortMethod, filter?: TimelineFilter, type?: TimelineType) =>
  async (dispatch, getState) => {
    dispatch(setLoading(true));

    try {
      const {timelineState, userState} = getState();
      const timelineType = type ?? timelineState.type;
      const timelineFilter = filter ?? timelineState.filter;
      const timelineSort = sort ?? timelineState.sort;

      let posts: Post[] = [];

      if (userState.user && timelineType === TimelineType.DEFAULT) {
        posts = await PostAPI.getFriendPost(userState.user.id, page, timelineSort);
      }

      if (userState.anonymous || timelineType === TimelineType.TRENDING) {
        posts = await PostAPI.getPost(page, timelineSort, timelineFilter);
      }

      // TODO: change this to include from API
      for await (const post of posts) {
        if (post.importBy && post.importBy.length > 0) {
          const user = await UserAPI.getUserDetail(post.importBy[0]);

          post.importer = user;
        }

        if (post.platform === 'myriad' && post.platformUser) {
          const user = await UserAPI.getUserDetail(post.platformUser.platform_account_id);

          post.platformUser.name = user.name;

          if (user.profilePictureURL) {
            const sizes = generateImageSizes(user.profilePictureURL);
            post.platformUser.profile_image_url = sizes.thumbnail;
          } else {
            post.platformUser.profile_image_url = '';
          }
        }
      }

      dispatch({
        type: constants.LOAD_TIMELINE,
        posts,
        meta: {
          page,
          hasMore: posts.length > 0,
          sort,
          filter,
          type,
        },
      });
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const createPost: ThunkActionCreator<Actions, RootState> =
  (post: Partial<Post>, images: string[]) => async (dispatch, getState) => {
    const {
      userState: {user},
    } = getState();

    setLoading(true);

    try {
      if (!user) {
        throw new Error('User not found');
      }

      const hasMedia = images.length > 0;

      // TODO: simplify this
      const data = await PostAPI.createPost({
        ...post,
        platform: 'myriad',
        hasMedia,
        asset: {
          images,
          videos: [],
        },
        platformUser: {
          name: user.name,
          username: user.name,
          platform_account_id: user.id,
          profile_image_url: user.profilePictureURL || '',
        },
        walletAddress: user.id,
      });

      dispatch({
        type: constants.ADD_POST_TO_TIMELINE,
        post: {
          ...data,
          comments: [],
        },
      });
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const importPost: ThunkActionCreator<Actions, RootState> =
  (postUrl: string) => async (dispatch, getState) => {
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
      });

      post.importer = user;

      dispatch({
        type: constants.ADD_POST_TO_TIMELINE,
        post,
      });
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const toggleLikePost: ThunkActionCreator<Actions, RootState> =
  (postId: string, like = true) =>
  async (dispatch, getState) => {
    dispatch(setLoading(true));

    try {
      const {
        userState: {user},
      } = getState();

      if (!user) {
        throw new Error('User not found');
      }

      let likeList = await PostAPI.getLikes(postId);
      likeList = likeList.filter(
        likeStatus => likeStatus.userId === user.id && likeStatus.status == true,
      );
      let dislikeList = await PostAPI.getDislikes(postId);
      dislikeList = dislikeList.filter(
        dislikeStatus => dislikeStatus.userId === user.id && dislikeStatus.status == true,
      );

      if (like) {
        if (!likeList.length && !dislikeList.length) {
          dispatch({
            type: constants.LIKE_POST,
            postId,
          });
        } else if (!likeList.length && dislikeList.length) {
          dispatch({
            type: constants.LIKE_POST,
            postId,
          });
          dispatch({
            type: constants.UNDISLIKE_POST,
            postId,
          });
        } else if (likeList.length) {
          dispatch({
            type: constants.UNLIKE_POST,
            postId,
          });
        }
        await PostAPI.like(user.id, postId);
      } else {
        if (!likeList.length && !dislikeList.length) {
          dispatch({
            type: constants.DISLIKE_POST,
            postId,
          });
        } else if (!dislikeList.length && likeList.length) {
          dispatch({
            type: constants.DISLIKE_POST,
            postId,
          });
          dispatch({
            type: constants.UNLIKE_POST,
            postId,
          });
        } else if (dislikeList.length) {
          dispatch({
            type: constants.UNDISLIKE_POST,
            postId,
          });
        }

        await PostAPI.dislike(user.id, postId);
      }
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const fetchWalletDetails: ThunkActionCreator<Actions, RootState> =
  (postId: string) => async dispatch => {
    dispatch(setLoading(true));
    try {
      const {walletAddress} = await WalletAddressAPI.getWalletAddress(postId);

      const walletDetailPayload = {
        walletAddress,
        postId,
        contentType: ContentType.POST,
      };

      dispatch({
        type: constants.FETCH_WALLET_DETAILS,
        payload: walletDetailPayload,
      });
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

export const deletePost: ThunkActionCreator<Actions, RootState> =
  (postId: string) => async (dispatch, getState) => {
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
    } catch (error) {
      dispatch(setError(error.message));
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

      if (!user) {
        throw new Error('User not found');
      }
      console.log('masuk');
      const post = await PostAPI.getPostDetail(postId);
      dispatch(setPost(post));
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };
