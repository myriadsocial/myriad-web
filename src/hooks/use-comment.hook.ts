import { useState } from 'react';

import { Post, Comment } from 'src/interfaces/post';
import { User } from 'src/interfaces/user';
import * as PostAPI from 'src/lib/api/post';

export const useCommentHook = (post: Post) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);

    try {
      const comments = await PostAPI.loadComments(post.id);

      setComments(comments);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    try {
      const data = await PostAPI.loadComments(post.id);

      setComments([...comments, ...data]);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const reply = async (user: User, comment: Comment) => {
    const data = await PostAPI.reply(post.id, comment);

    setComments([
      ...comments,
      {
        ...data,
        user
      }
    ]);
  };

  return {
    error,
    loading,
    comments,
    loadInitComment: load,
    loadMoreComment: loadMore,
    reply
  };
};
