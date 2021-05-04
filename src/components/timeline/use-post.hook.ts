import { useState, useEffect } from 'react';

import { User } from 'next-auth';

import { SocialsEnum } from '../../interfaces';
import { useLayoutSetting } from '../Layout/layout.context';
import { useExperience } from '../experience/experience.context';
import { useTimeline, TimelineActionType } from './timeline.context';

import { WithAdditionalParams } from 'next-auth/_utils';
import { Comment, Post, PostSortMethod } from 'src/interfaces/post';
import * as LocalAPI from 'src/lib/api/local';
import * as PostAPI from 'src/lib/api/post';

export const usePost = () => {
  const { state: experienceState } = useExperience();
  const { state: timelineState, dispatch } = useTimeline();
  const { state: settingState } = useLayoutSetting();

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

  const loadMorePost = async () => {
    dispatch({
      type: TimelineActionType.LOAD_MORE_POST
    });
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

    const data = await PostAPI.createPost({
      text,
      tags: tags,
      hasMedia,
      platform: 'myriad',
      assets: hasMedia ? images : [],
      platformUser: {
        username,
        platform_account_id: accountId
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

  const reply = async (postId: string, comment: Comment) => {
    const data = await PostAPI.reply(postId, comment);

    dispatch({
      type: TimelineActionType.ADD_COMMENT,
      postId,
      comment: data
    });
  };

  const sortBy = (sort: PostSortMethod) => {
    dispatch({
      type: TimelineActionType.SORT_POST,
      sort
    });
  };

  const importPost = async (URL: string) => {
    console.log('the URL is: ', URL);
    //put API to import post below
    //const data = await PostAPI.createPost({
    //text,
    //tags: tags,
    //hasMedia,
    //platform: 'myriad',
    //assets: hasMedia ? images : [],
    //platformUser: {
    //username,
    //platform_account_id: accountId
    //},
    //walletAddress: accountId
    //});
    //dispatch({
    //type: TimelineActionType.CREATE_POST,
    //post: {
    //...data,
    //comments: []
    //}
    //});
  };

  return {
    error,
    loading,
    hasMore,
    sort: timelineState.sort,
    loadPost,
    loadMorePost,
    loadComments,
    addPost,
    reply,
    sortBy,
    importPost
  };
};
