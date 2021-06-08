import { useState, useEffect } from 'react';

import { useAlertHook } from './use-alert.hook';

import { useExperience } from 'src/components/experience/experience.context';
import { useLayoutSetting } from 'src/context/layout.context';
import { useTimeline, TimelineActionType } from 'src/context/timeline.context';
import { SocialsEnum } from 'src/interfaces';
import { Post, PostSortMethod } from 'src/interfaces/post';
import { User } from 'src/interfaces/user';
import * as LocalAPI from 'src/lib/api/local';
import * as PostAPI from 'src/lib/api/post';
import * as UserAPI from 'src/lib/api/user';

export const usePost = (user: User) => {
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

  const loadUserPost = async (page: number = 1, sort?: PostSortMethod) => {
    setLoading(true);

    try {
      const data = await PostAPI.getFriendPost(user.id, page, sort);

      if (data.length < 10) {
        setHasMore(false);
      }

      if (data.length > 0) {
        for await (const post of data) {
          console.log('post.importBy', post.importBy);
          if (post.importBy && post.importBy.length > 0) {
            const user = await UserAPI.getUserDetail(post.importBy[0]);

            post.importer = user;
          }
        }
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

  const loadPost = async () => {
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

  const loadMorePost = async () => {
    dispatch({
      type: TimelineActionType.LOAD_MORE_POST
    });

    await loadUserPost(timelineState.page + 1);
  };

  const sortBy = async (sort: PostSortMethod) => {
    dispatch({
      type: TimelineActionType.SORT_POST,
      sort
    });

    await loadUserPost(1, sort);
  };

  const addPost = async (text: string, tags: string[], files: File[]) => {
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

    const data = await PostAPI.createPost({
      text,
      tags: tags,
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

  const importPost = async (url: string, importer?: string) => {
    setLoading(true);

    try {
      const data = await PostAPI.importPost({
        url,
        importer: importer || user.id
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

  const likePost = async (postId: string) => {
    setLoading(true);

    try {
      await PostAPI.like(user.id, postId);
    } catch (error) {
      console.log('error likePost: ', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const dislikePost = async (postId: string) => {
    setLoading(true);

    try {
      await PostAPI.dislike(user.id, postId);
    } catch (error) {
      console.log('error from use post hooks: ', error);
      setError(error);
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
    sortBy,
    importPost,
    likePost,
    dislikePost
  };
};
