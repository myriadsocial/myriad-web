// @ts-nocheck
import { useState, useEffect } from 'react';

import { useExperience } from '../experience/experience.context';
import { useTimeline, TimelineActionType } from './timeline.context';

import Axios from 'axios';
import { sortBy } from 'lodash';
import { People } from 'src/interfaces/experience';
import { Comment, Post, PostSortMethod } from 'src/interfaces/post';

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://34.101.124.163:3000'
});

type SortDirection = 'DESC' | 'ASC';
type SortResult = {
  field: string;
  direction: SortDirection;
};

export const usePost = () => {
  const { state: experienceState } = useExperience();
  const { state: timelineState, dispatch } = useTimeline();

  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sort, setSort] = useState<SortResult>({
    field: 'platformCreatedAt',
    direction: 'DESC'
  });
  const [filter, setFilter] = useState({
    offset: 0,
    limit: 10,
    where: {},
    order: 'platformCreatedAt DESC',
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

  useEffect(() => {
    setFilter({
      ...filter,
      order: sort.field + ' ' + sort.direction
    });
  }, [sort]);

  // change post filter every selected experience changed
  // each experience has people and tag attribute as filter parameter
  useEffect(() => {
    console.log('experienceState.selected', experienceState.selected);
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
            'platformUser.username': {
              inq: people.filter(i => !i.hide).map(i => i.username)
            }
          }
        ]
      };

      if (layout === 'photo') {
        where['hasMedia'] = true;
      }

      console.log('where', where);
      setFilter({
        ...filter,
        where
      });

      setReload(true);
    }
  }, [experienceState.selected?.id]);

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

      if (data.length < filter.limit) {
        setHasMore(false);
      }

      dispatch({
        type: TimelineActionType.INIT_POST,
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

      if (data.length < filter.limit) {
        setHasMore(false);
      }

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

  const addPost = async (value: Partial<Post>) => {
    const { data } = await axios({
      url: `/posts`,
      method: 'POST',
      data: value
    });

    // dispatch({
    //   type: TimelineActionType.ADD_COMMENT,
    //   postId,
    //   comment: data
    // });
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

  const sortBy = (sort: PostSortMethod) => {
    dispatch({
      type: TimelineActionType.SORT_POST,
      sort
    });
  };

  return {
    error,
    loading,
    hasMore,
    sort: timelineState.sort,
    posts: timelineState.posts,
    loadMorePost,
    loadComments,
    addPost,
    reply,
    sortBy
  };
};
