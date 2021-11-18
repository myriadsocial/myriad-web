import {useState} from 'react';
import {useSelector} from 'react-redux';

import {Comment, CommentProps} from 'src/interfaces/comment';
import {SectionType, Vote} from 'src/interfaces/interaction';
import {User} from 'src/interfaces/user';
import * as CommentAPI from 'src/lib/api/comment';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

type useCommentHookProps = {
  error: any;
  loading: boolean;
  comments: Comment[];
  loadInitComment: (section?: SectionType) => void;
  loadMoreComment: () => void;
  reply: (user: User, comment: CommentProps, callback?: () => void) => void;
  updateUpvote: (commentId: string, total: number, vote: Vote) => void;
  updateDownvote: (commentId: string, total: number, vote: Vote) => void;
  updateRemoveUpvote: (commentId: string) => void;
  loadReplies: (referenceId: string, deep: number) => void;
};

export const useCommentHook = (referenceId: string): useCommentHookProps => {
  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const load = async (section?: SectionType) => {
    setLoading(true);

    try {
      const {data: comments} = await CommentAPI.loadComments(referenceId, section);

      setComments(
        comments.map(comment => {
          const upvoted = comment.votes?.filter(vote => vote.userId === user?.id && vote.state);
          const downvoted = comment.votes?.filter(vote => vote.userId === user?.id && !vote.state);

          comment.isUpvoted = upvoted && upvoted.length > 0;
          comment.isDownVoted = downvoted && downvoted.length > 0;

          return comment;
        }),
      );
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    try {
      const {data} = await CommentAPI.loadComments(referenceId);

      setComments([
        ...comments,
        ...data.map(comment => {
          const upvoted = comment.votes?.filter(vote => vote.userId === user?.id && vote.state);
          const downvoted = comment.votes?.filter(vote => vote.userId === user?.id && !vote.state);

          comment.isUpvoted = upvoted && upvoted.length > 0;
          comment.isDownVoted = downvoted && downvoted.length > 0;

          return comment;
        }),
      ]);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const reply = async (user: User, comment: CommentProps, callback?: () => void) => {
    const data = await CommentAPI.reply(comment);

    // if replying post
    if (comment.referenceId === referenceId) {
      setComments(prevComments => [...prevComments, {...data, user}]);
    } else {
      const newComment = comments.map(item => {
        if (item.id === data.referenceId) {
          item.replies?.push({...data, user});
        }

        if (item.replies) {
          item.replies.map(reply => {
            if (reply.id === data.referenceId) {
              reply.replies?.push({...data, user});
            }
            return reply;
          });
        }
        return item;
      });

      setComments(newComment);
    }

    callback && callback();
  };

  const updateUpvote = (commentId: string, total: number, vote: Vote) => {
    const modifyVotes = (comment: Comment) => {
      if (comment.id === commentId) {
        comment.metric.upvotes = total;

        if (comment.isDownVoted) {
          comment.metric.downvotes -= 1;
        }

        comment.isUpvoted = true;
        comment.isDownVoted = false;
        comment.votes = [vote];
      }

      return comment;
    };

    setComments(prevComments => {
      return prevComments.map(comment => {
        comment = modifyVotes(comment);

        if (comment.replies) {
          comment.replies.map(reply => {
            if (reply.id === commentId) {
              reply = modifyVotes(reply);
            }

            if (reply.replies) {
              reply.replies.map(item => {
                item = modifyVotes(item);

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

  const updateDownvote = (commentId: string, total: number, vote: Vote) => {
    const modifyVotes = (comment: Comment) => {
      if (comment.id === commentId) {
        comment.metric.downvotes = total;

        if (comment.isUpvoted) {
          comment.metric.upvotes -= 1;
        }

        comment.isUpvoted = false;
        comment.isDownVoted = true;
        comment.votes = [vote];
      }

      return comment;
    };

    setComments(prevComments => {
      return prevComments.map(comment => {
        comment = modifyVotes(comment);

        if (comment.replies) {
          comment.replies.map(reply => {
            reply = modifyVotes(reply);

            if (reply.replies) {
              reply.replies.map(item => {
                item = modifyVotes(item);

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

  const updateRemoveUpvote = (commentId: string) => {
    const modifyVotes = (comment: Comment) => {
      if (comment.id === commentId) {
        if (comment.isDownVoted) {
          comment.metric.downvotes -= 1;
        }

        if (comment.isUpvoted) {
          comment.metric.upvotes -= 1;
        }

        comment.isUpvoted = false;
        comment.isDownVoted = false;
        comment.votes = [];
      }

      return comment;
    };

    setComments(prevComments => {
      return prevComments.map(comment => {
        comment = modifyVotes(comment);

        if (comment.replies) {
          comment.replies.map(reply => {
            reply = modifyVotes(reply);

            if (reply.replies) {
              reply.replies.map(item => {
                item = modifyVotes(item);

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
      const {data} = await CommentAPI.loadComments(referenceId);

      const comments = data.map(comment => {
        const upvoted = comment.votes?.filter(vote => vote.userId === user?.id && vote.state);
        const downvoted = comment.votes?.filter(vote => vote.userId === user?.id && !vote.state);

        comment.isUpvoted = upvoted && upvoted.length > 0;
        comment.isDownVoted = downvoted && downvoted.length > 0;

        return comment;
      });

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
    updateRemoveUpvote,
    loadReplies,
  };
};
