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
  reply: (user: User, comment: CommentProps, callback?: () => void) => void;
  updateUpvote: (commentId: string, vote: number) => void;
  updateDownvote: (commentId: string, vote: number) => void;
  loadReplies: (referenceId: string, deep: number) => void;
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

  const reply = async (user: User, comment: CommentProps, callback?: () => void) => {
    const data = await CommentAPI.reply(comment);
    let flag = true;
    const newComment = comments.map(item => {
      if (item.id === data.referenceId) {
        item.replies?.push({...data, user});
        flag = false;
      }
      if (item.replies) {
        item.replies.map(reply => {
          if (reply.id === data.referenceId) {
            reply.replies?.push({...data, user});
            flag = false;
          }
          return reply;
        });
      }
      return item;
    });
    if (flag) {
      setComments([
        ...comments,
        {
          ...data,
          user,
        },
      ]);
    } else {
      setComments(newComment);
    }
    flag = true;
    callback && callback();
  };

  const updateUpvote = (commentId: string, vote: number) => {
    setComments(prevComments => {
      return prevComments.map(comment => {
        if (comment.id === commentId) {
          comment.metric.upvotes = vote;
        }
        if (comment.replies) {
          comment.replies.map(reply => {
            if (reply.id === commentId) reply.metric.upvotes = vote;
            if (reply.replies) {
              reply.replies.map(item => {
                if (item.id === commentId) item.metric.upvotes = vote;
                return item;
              });
            }
            return reply;
          });
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
        if (comment.replies) {
          comment.replies.map(reply => {
            if (reply.id === commentId) reply.metric.downvotes = vote;
            if (reply.replies) {
              reply.replies.map(item => {
                if (item.id === commentId) item.metric.downvotes = vote;
                return item;
              });
            }
            return reply;
          });
        }
        return comment;
      });
    });
  };

  const loadReplies = async (referenceId: string, deep: number) => {
    try {
      const {data: comments} = await CommentAPI.loadComments(referenceId);

      setComments(prevComments => {
        return prevComments.map(item => {
          if (deep === 0) {
            if (item.id === referenceId) {
              item.replies = comments;
            }
          } else {
            if (item.replies) {
              item.replies.map(reply => {
                if (reply.id === referenceId) {
                  reply.replies = comments;
                }

                return reply;
              });
            }
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
