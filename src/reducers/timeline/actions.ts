import { Actions as BaseAction, setLoading, setError } from '../base/actions';
import { RootState } from '../index';
import * as constants from './constants';

import { Action } from 'redux';
import { Post } from 'src/interfaces/post';
import { TimelineFilter, TimelineSortMethod, TimelineType } from 'src/interfaces/timeline';
import * as LocalAPI from 'src/lib/api/local';
import * as PostAPI from 'src/lib/api/post';
import { ThunkActionCreator } from 'src/types/thunk';

/**
 * Action Types
 */

export interface LoadTimeline extends Action {
  type: constants.LOAD_TIMELINE;
  posts: Post[];
  meta: {
    page: number;
    sort?: TimelineSortMethod;
    filter?: TimelineFilter;
    type?: TimelineType;
  };
}

export interface AddPostToTimeline extends Action {
  type: constants.ADD_POST_TO_TIMELINE;
  post: Post;
}

/**
 * Union Action Types
 */

export type Actions = LoadTimeline | AddPostToTimeline | BaseAction;

/**
 *
 * Actions
 */

/**
 * Action Creator
 */
export const loadTimeline: ThunkActionCreator<Actions, RootState> = (
  page = 1,
  sort?: TimelineSortMethod,
  filter?: TimelineFilter,
  type?: TimelineType
) => async (dispatch, getState) => {
  dispatch(setLoading(true));

  try {
    const { timelineState, userState } = getState();
    let posts: Post[] = [];

    if (userState.user && timelineState.type === TimelineType.DEFAULT) {
      posts = await PostAPI.getFriendPost(userState.user.id, page, sort);
    }

    if (userState.anonymous || timelineState.type === TimelineType.TRENDING) {
      posts = await PostAPI.getPost(page, sort, filter ?? timelineState.filter);
    }

    dispatch({
      type: constants.LOAD_TIMELINE,
      posts,
      meta: {
        page,
        sort,
        filter,
        type
      }
    });
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const createPost: ThunkActionCreator<Actions, RootState> = (text: string, tags: string[], files: File[]) => async (
  dispatch,
  getState
) => {
  const images: string[] = [];
  const hasMedia = files.length > 0;
  const {
    userState: { user }
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
        profilePictureURL: user.profilePictureURL
      },
      walletAddress: user.id
    });

    dispatch({
      type: constants.ADD_POST_TO_TIMELINE,
      post: {
        ...data,
        comments: []
      }
    });
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const importPost: ThunkActionCreator<Actions, RootState> = (postUrl: string) => async (dispatch, getState) => {
  dispatch(setLoading(true));

  try {
    const {
      userState: { user }
    } = getState();

    if (!user) {
      throw new Error('User not found');
    }

    const post = await PostAPI.importPost({
      url: postUrl,
      importer: user.id
    });

    dispatch({
      type: constants.ADD_POST_TO_TIMELINE,
      post
    });
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};
