import { useState, useEffect } from 'react';

import { User } from 'next-auth';

import { SocialsEnum } from '../../interfaces';
import { useLayoutSetting } from '../Layout/layout.context';
import { useExperience } from '../experience/experience.context';
import { useTimeline, TimelineActionType } from './timeline.context';

import { WithAdditionalParams } from 'next-auth/_utils';
import { useAlertHook } from 'src/components/alert/use-alert.hook';
import { Comment, Post, PostSortMethod } from 'src/interfaces/post';
import * as LocalAPI from 'src/lib/api/local';
import * as PostAPI from 'src/lib/api/post';

export const usePost = () => {
  const { state: experienceState } = useExperience();
  const { state: timelineState, dispatch } = useTimeline();
  const { state: settingState } = useLayoutSetting();
  const { showAlert } = useAlertHook();

  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // change people and tag filter each selected experience changed or focus setting changed
  useEffect(() => {
    if (!experienceState.init && experienceState.selected) {
      const { people, tags, layout } = experienceState.selected;

      const include: SocialsEnum[] = [];

      if (settingState.facebook) {
        include.push(SocialsEnum.FACEBOOK);
      }

      if (settingState.reddit) {
        include.push(SocialsEnum.REDDIT);
      }

      if (settingState.twitter) {
        include.push(SocialsEnum.TWITTER);
      }

      dispatch({
        type: TimelineActionType.UPDATE_FILTER,
        filter: {
          tags: settingState.topic ? tags.filter(tag => !tag.hide).map(tag => tag.id) : [],
          people: settingState.people ? people.filter(person => !person.hide).map(person => person.username) : [],
          layout: layout || 'timeline',
          platform: include
        }
      });
    }
  }, [
    experienceState.selected?.id,
    settingState.people,
    settingState.topic,
    settingState.facebook,
    settingState.twitter,
    settingState.reddit
  ]);

  const loadUserPost = async (user: WithAdditionalParams<User>, page: number = 1, sort?: PostSortMethod) => {
    setLoading(true);

    try {
      const data = await PostAPI.getFriendPost(user.address as string, page, sort);

      if (data.length < 10) {
        setHasMore(false);
      }

      dispatch({
        type: TimelineActionType.LOAD_POST,
        posts: data.map((item: Post) => ({ ...item, comments: item.comments || [] }))
      });
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const loadPost = async (user: WithAdditionalParams<User>) => {
    setLoading(true);

    try {
      const data = await PostAPI.getPost(user, timelineState.page, timelineState.sort, timelineState.filter);

      if (data.length < 10) {
        setHasMore(false);
      }

      dispatch({
        type: TimelineActionType.LOAD_POST,
        posts: data.map((item: Post) => ({ ...item, comments: item.comments || [] }))
      });
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const loadMorePost = async (user: WithAdditionalParams<User>) => {
    dispatch({
      type: TimelineActionType.LOAD_MORE_POST
    });

    await loadUserPost(user, timelineState.page + 1);
  };

  const sortBy = async (user: WithAdditionalParams<User>, sort: PostSortMethod) => {
    dispatch({
      type: TimelineActionType.SORT_POST,
      sort
    });

    await loadUserPost(user, 1, sort);
  };

  const addPost = async (text: string, tags: string[], files: File[], user: WithAdditionalParams<User>) => {
    const images: string[] = [];

    if (files.length) {
      const uploadedURLs = await Promise.all(files.map(file => LocalAPI.uploadImage(file)));

      uploadedURLs.forEach(url => {
        if (url) {
          images.push(url);
        }
      });
    }

    const hasMedia = files.length > 0;
    const username = user.name as string;
    const accountId = user.address as string;
    const userProfilePicture = user.profilePictureURL as string;

    const data = await PostAPI.createPost({
      text,
      tags: tags,
      hasMedia,
      platform: 'myriad',
      assets: hasMedia ? images : [],
      platformUser: {
        username,
        platform_account_id: accountId,
        profilePictureURL: userProfilePicture
      },
      walletAddress: accountId
    });

    dispatch({
      type: TimelineActionType.CREATE_POST,
      post: {
        ...data,
        comments: []
      }
    });
  };

  const loadComments = async (postId: string) => {
    const data = await PostAPI.loadComments(postId);

    dispatch({
      type: TimelineActionType.LOAD_COMMENTS,
      postId,
      comments: data
    });
  };

  const reply = async (postId: string, user: User, comment: Comment) => {
    const data = await PostAPI.reply(postId, comment);

    dispatch({
      type: TimelineActionType.ADD_COMMENT,
      postId,
      comment: {
        ...data,
        user
      }
    });
  };

  const importPost = async (url: string, importer?: string) => {
    setLoading(true);

    try {
      const data = await PostAPI.importPost({
        url,
        importer
      });

      dispatch({
        type: TimelineActionType.CREATE_POST,
        post: {
          ...data,
          comments: []
        }
      });

      showAlert({
        title: 'Success!',
        message: 'Post successfully imported',
        severity: 'success'
      });
    } catch (error) {
      console.log('error from use post hooks: ', error);
      setError(error);
      showAlert({
        title: 'Error!',
        message: 'Post already imported',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    error,
    loading,
    hasMore,
    sort: timelineState.sort,
    loadUserPost,
    loadPost,
    loadMorePost,
    loadComments,
    addPost,
    reply,
    sortBy,
    importPost
  };
};
