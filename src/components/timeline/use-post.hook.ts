import { useState, useEffect } from 'react';

import { useExperience } from '../experience/experience.context';
import { useTimeline, TimelineActionType } from './timeline.context';

import { Comment, Post, PostSortMethod } from 'src/interfaces/post';
import * as PostAPI from 'src/lib/api/post';

export const usePost = () => {
  const { state: experienceState } = useExperience();
  const { state: timelineState, dispatch } = useTimeline();

  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // change people and tag filter each selected experience changed
  useEffect(() => {
    if (!experienceState.init && experienceState.selected) {
      const { people, tags, layout } = experienceState.selected;

      dispatch({
        type: TimelineActionType.UPDATE_FILTER,
        filter: {
          tags: tags.filter(i => !i.hide).map(i => i.id),
          people: people.filter(i => !i.hide).map(i => i.username),
          layout: layout || 'timeline'
        }
      });
    }
  }, [experienceState.selected?.id]);

  const loadPost = async () => {
    setLoading(true);

    try {
      const data = await PostAPI.getPost(timelineState.page, timelineState.sort, timelineState.filter);

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

  const addPost = async (value: Partial<Post>) => {
    const data = await PostAPI.createPost(value);

    dispatch({
      type: TimelineActionType.CREATE_POST,
      post: data
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
    sortBy
  };
};
