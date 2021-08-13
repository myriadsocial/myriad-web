import {useState} from 'react';

import {Comment, CommentProps} from 'src/interfaces/comment';
import {Post} from 'src/interfaces/post';
import {User} from 'src/interfaces/user';
import * as CommentAPI from 'src/lib/api/comment';

type useCommentHookProps = {
  error: any;
  loading: boolean;
  comments: Comment[];
  loadInitComment: () => void;
  loadMoreComment: () => void;
  reply: (user: User, comment: CommentProps) => void;
};

export const useCommentHook = (post: Post): useCommentHookProps => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const load = async () => {
    setLoading(true);

    try {
      const {data: comments} = await CommentAPI.loadComments(post.id);

      setComments(comments);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    try {
      const {data} = await CommentAPI.loadComments(post.id);

      setComments([...comments, ...data]);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const reply = async (user: User, comment: CommentProps) => {
    const data = await CommentAPI.reply(comment);

    setComments([
      ...comments,
      {
        ...data,
        user,
      },
    ]);
  };

  return {
    error,
    loading,
    comments,
    loadInitComment: load,
    loadMoreComment: loadMore,
    reply,
  };
};
