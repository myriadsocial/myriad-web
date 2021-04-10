// @ts-nocheck
import { useState, useEffect } from 'react';

import { useExperience } from '../experience/experience.context';
import { useTimeline, TimelineActionType } from './timeline.context';

import Axios from 'axios';
import { People } from 'src/interfaces/experience';
import { Comment, Post } from 'src/interfaces/post';

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://34.101.124.163:3000'
});

export const usePost = () => {
  const { state: experienceState } = useExperience();
  const { state, dispatch } = useTimeline();
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({
    offset: 0,
    limit: 10,
    skip: 0,
    where: {},
    include: [
      {
        relation: 'comments',
        scope: {
          include: [
            {
              relation: 'user'
            }
          ]
        }
      }
    ]
  });

  // change post filter every selected experience changed
  // each experience has people and tag attribute as filter parameter
  useEffect(() => {
    if (!experienceState.init && experienceState.selected) {
      const { people, tags } = experienceState.selected;

      setFilter({
        ...filter,
        where: {
          or: [
            {
              tags: {
                inq: tags.filter(i => !i.hide).map(i => i.id)
              }
            },
            {
              'people.username': {
                inq: people.filter(i => !i.hide).map(i => i.username)
              }
            }
          ]
        }
      });

      setReload(true);
    }

    return undefined;
  }, [experienceState.selected]);

  // fetch intial post every where filter changed
  useEffect(() => {
    if (reload) {
      load();
    }
  }, [reload]);

  const load = async (type: TimelineActionType = TimelineActionType.INIT_POST) => {
    setLoading(true);

    try {
      const { data } = await axios({
        url: '/posts',
        method: 'GET',
        params: {
          filter
        }
      });

      dispatch({
        type,
        posts: data.map((item: Post) => ({ ...item, comments: item.comments || [] }))
      });
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
      setReload(false);
    }
  };

  const loadMorePost = () => {
    setFilter({
      ...filter,
      skip: (filter.skip + 1) * filter.limit
    });

    load(TimelineActionType.LOAD_MORE_POST);
  };

  const loadComments = async (postId: string) => {
    const { data } = await axios({
      url: `/posts/${postId}/comments`,
      params: {
        include: ['user']
      },
      method: 'GET'
    });

    dispatch({
      type: TimelineActionType.LOAD_COMMENTS,
      postId,
      comments: data
    });
  };

  const reply = async (postId: string, comment: Comment) => {
    const { data } = await axios({
      url: `/posts/${postId}/comments`,
      method: 'POST',
      data: comment
    });

    dispatch({
      type: TimelineActionType.ADD_COMMENT,
      postId,
      comment: data
    });
  };

  return {
    error,
    loading,
    posts: state.posts,
    loadMorePost,
    loadComments,
    reply
  };
};
