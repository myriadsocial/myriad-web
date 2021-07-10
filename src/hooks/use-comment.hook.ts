import { useState } from 'react';

import { Post, Comment, CreateCommentProps } from 'src/interfaces/post';
import { User } from 'src/interfaces/user';
import * as PostAPI from 'src/lib/api/post';

type useCommentHookProps = {
  error: any;
  loading: boolean;
  comments: Comment[];
  loadInitComment: () => void;
  loadMoreComment: () => void;
  reply: (user: User, comment: CreateCommentProps) => void;
};

export const useCommentHook = (post: Post): useCommentHookProps => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

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

  const reply = async (user: User, comment: CreateCommentProps) => {
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
