import {Actions as BaseAction, setLoading, setError} from '../base/actions';
import {RootState} from '../index';
import * as constants from './constants';

import {Action} from 'redux';
import {Post} from 'src/interfaces/post';
import {TimelineFilter, TimelineSortMethod, TimelineType} from 'src/interfaces/timeline';
import * as LocalAPI from 'src/lib/api/local';
import * as PostAPI from 'src/lib/api/post';
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

export interface UnlikePost extends Action {
  type: constants.UNLIKE_POST;
  postId: string;
}

export interface DislikePost extends Action {
  type: constants.DISLIKE_POST;
  postId: string;
}

export interface UndislikePost extends Action {
  type: constants.UNDISLIKE_POST;
  postId: string;
}

export interface UpdateTimelineFilter extends Action {
  type: constants.UPDATE_TIMELINE_FILTER;
  filter: TimelineFilter;
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
  | UnlikePost
  | UndislikePost
  | BaseAction;

export const updateFilter = (filter: TimelineFilter): UpdateTimelineFilter => ({
  type: constants.UPDATE_TIMELINE_FILTER,
  filter,
});

/**
 *
 * Actions
 */

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
  (text: string, tags: string[], files: File[]) => async (dispatch, getState) => {
    const images: string[] = [];
    const hasMedia = files.length > 0;
    const {
      userState: {user},
    } = getState();

    setLoading(true);

    try {
      if (!user) {
        throw new Error('User not found');
      }

      if (hasMedia) {
        // TODO: upload multiple file
        const uploadedURLs = await Promise.all(files.map(file => LocalAPI.uploadImage(file)));

        uploadedURLs.forEach(url => {
          if (url) {
            images.push(url);
          }
        });
      }

      // TODO: simplify this
      const data = await PostAPI.createPost({
        text,
        tags,
        hasMedia,
        platform: 'myriad',
        assets: hasMedia ? images : [],
        platformUser: {
          username: user.name,
          platform_account_id: user.id,
          profilePictureURL: user.profilePictureURL,
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
