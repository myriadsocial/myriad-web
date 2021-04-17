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
  const [page, setPage] = useState(0);
  const { state, dispatch } = useTimeline();
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({
    offset: 0,
    limit: 10,
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
      const { people, tags, layout } = experienceState.selected;

      let where = {
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
      };

      if (layout === 'photo') {
        where['hasMedia'] = true;
      }

      setFilter({
        ...filter,
        where
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

  const load = async () => {
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
<<<<<<< HEAD
        type,
=======
        type: TimelineActionType.INIT_POST,
>>>>>>> 5ea73e4d94e20dbd1f849f67e307a7c6619900c2
        posts: data.map((item: Post) => ({ ...item, comments: item.comments || [] }))
      });
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
      setReload(false);
    }
  };

  const loadMorePost = async () => {
    const nextPage = page + 1;
    const offset = nextPage * filter.limit;

    setLoading(true);

    try {
      const { data } = await axios.request<Post[]>({
        url: '/posts',
        method: 'GET',
        params: {
          filter: {
            ...filter,
            offset
          }
        }
      });

      dispatch({
        type: TimelineActionType.LOAD_MORE_POST,
        posts: data.map((item: Post) => ({ ...item, comments: item.comments || [] }))
      });
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
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
