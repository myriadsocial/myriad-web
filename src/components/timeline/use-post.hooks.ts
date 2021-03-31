// @ts-nocheck
import { useState } from 'react';

import { useTimeline, TimelineActionType } from './timeline.context';

import Axios from 'axios';
import { Comment, Post } from 'src/interfaces/post';

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://34.101.124.163:3000'
});

export const usePost = () => {
  const { state, dispatch } = useTimeline();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [params, setParams] = useState({
    offset: 0,
    limit: 10,
    skip: 0,
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

  const load = async (type: TimelineActionType = TimelineActionType.INIT_POST, tags: string[] = []) => {
    setLoading(true);

    let filter = params;

    if (tags.length > 0) {
      filter = {
        ...filter,
        where: {
          tags: {
            inq: tags
          }
        }
      };
    }

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
    }
  };

  const loadMorePost = () => {
    setParams({
      ...params,
      skip: (params.skip + 1) * params.limit
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
    console.log('loadComments', data);
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
    loadInitPost: load,
    loadMorePost,
    loadComments,
    reply
  };
};
