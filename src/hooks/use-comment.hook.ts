import {useState} from 'react';

import {Comment, CommentProps} from 'src/interfaces/comment';
import {SectionType} from 'src/interfaces/interaction';
import {User} from 'src/interfaces/user';
import * as CommentAPI from 'src/lib/api/comment';

type useCommentHookProps = {
  error: any;
  loading: boolean;
  comments: Comment[];
  loadInitComment: (section?: SectionType) => void;
  loadMoreComment: () => void;
  reply: (user: User, comment: CommentProps) => void;
  updateUpvote: (commentId: string, vote: number) => void;
  updateDownvote: (commentId: string, vote: number) => void;
  loadReplies: (referenceId: string) => void;
};

export const useCommentHook = (referenceId: string): useCommentHookProps => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const load = async (section?: SectionType) => {
    setLoading(true);

    try {
      const {data: comments} = await CommentAPI.loadComments(referenceId, section);

      setComments(comments);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    try {
      const {data} = await CommentAPI.loadComments(referenceId);

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

  const updateUpvote = (commentId: string, vote: number) => {
    setComments(prevComments => {
      return prevComments.map(comment => {
        if (comment.id === commentId) {
          comment.metric.upvotes = vote;
        }

        return comment;
      });
    });
  };

  const updateDownvote = (commentId: string, vote: number) => {
    setComments(prevComments => {
      return prevComments.map(comment => {
        if (comment.id === commentId) {
          comment.metric.downvotes = vote;
        }

        return comment;
      });
    });
  };

  const loadReplies = async (referenceId: string) => {
    try {
      const {data: comments} = await CommentAPI.loadComments(referenceId);

      setComments(prevComments => {
        return prevComments.map(item => {
          if (item.id === referenceId) {
            item.replies = comments;
          }

          return item;
        });
      });
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    error,
    loading,
    comments,
    loadInitComment: load,
    loadMoreComment: loadMore,
    reply,
    updateUpvote,
    updateDownvote,
    loadReplies,
  };
};
