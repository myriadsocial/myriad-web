import { useState } from 'react';

import { useComments, CommentActionType } from './comment.context';

import { Post, Comment } from 'src/interfaces/post';
import { User } from 'src/interfaces/user';
import * as PostAPI from 'src/lib/api/post';

export const useCommentHook = (post: Post) => {
  const { dispatch } = useComments();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);

    try {
      const comments = await PostAPI.loadComments(post.id);

      dispatch({
        type: CommentActionType.LOAD_COMMENTS,
        payload: {
          comments,
          post
        }
      });
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    try {
      const comments = await PostAPI.loadComments(post.id);

      dispatch({
        type: CommentActionType.LOAD_MORE_COMMENT,
        payload: comments
      });
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const reply = async (user: User, comment: Comment) => {
    const data = await PostAPI.reply(post.id, comment);

    dispatch({
      type: CommentActionType.REPLY_COMMENT,
      payload: {
        ...data,
        user
      }
    });
  };

  return {
    error,
    loading,
    loadInitComment: load,
    loadMoreComment: loadMore,
    reply
  };
};
