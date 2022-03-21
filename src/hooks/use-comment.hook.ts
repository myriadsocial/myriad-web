import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {delay} from 'lodash';
import {Comment, CommentProps} from 'src/interfaces/comment';
import {SectionType, Vote} from 'src/interfaces/interaction';
import {User} from 'src/interfaces/user';
import * as CommentAPI from 'src/lib/api/comment';
import {ListMeta} from 'src/lib/api/interfaces/base-list.interface';
import {RootState} from 'src/reducers';
import {increaseCommentCount, updatePostMetric} from 'src/reducers/timeline/actions';
import {UserState} from 'src/reducers/user/reducer';

type useCommentHookProps = {
  error: any;
  loading: boolean;
  comments: Comment[];
  hasMoreComment: boolean;
  loadInitComment: (section?: SectionType) => void;
  loadMoreComment: () => void;
  reply: (user: User, comment: CommentProps, callback?: () => void) => void;
  updateUpvote: (commentId: string, total: number, vote: Vote) => void;
  updateDownvote: (commentId: string, total: number, vote: Vote) => void;
  updateRemoveUpvote: (commentId: string) => void;
  loadReplies: (referenceId: string, deep: number) => void;
  remove: (comment: Comment) => void;
};

export const useCommentHook = (referenceId: string): useCommentHookProps => {
  const dispatch = useDispatch();
  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [dataMeta, setDataMeta] = useState<ListMeta>({
    currentPage: 0,
    itemsPerPage: 0,
    totalItemCount: 0,
    totalPageCount: 0,
    nextPage: 0,
  });

  const load = async (section?: SectionType) => {
    setLoading(true);

    const filters = {
      referenceId,
      section,
    };

    try {
      const {data: comments, meta} = await CommentAPI.loadComments(filters, {page: 1});
      setDataMeta(meta);
      setComments(
        comments
          .filter(com => !com.user?.deletedAt)
          .map(comment => {
            const upvoted = comment.votes?.filter(vote => vote.userId === user?.id && vote.state);
            const downvoted = comment.votes?.filter(
              vote => vote.userId === user?.id && !vote.state,
            );

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
    const filters = {
      referenceId,
    };

    try {
      const {data, meta} = await CommentAPI.loadComments(filters, {page: dataMeta.nextPage ?? 1});
      setDataMeta(meta);
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
    const postId = data.postId;

    // if replying post
    if (comment.referenceId === referenceId) {
      setComments(prevComments => [{...data, user}, ...prevComments]);
    } else {
      const newComment = comments.map(item => {
        if (item.id === data.referenceId && item.replies) {
          item.replies.unshift({...data, user});
        }

        if (item.replies) {
          item.replies.map(reply => {
            if (reply.id === data.referenceId && reply.replies) {
              reply.replies.unshift({...data, user});
            }
            return reply;
          });
        }
        return item;
      });

      setComments(newComment);
    }

    dispatch(increaseCommentCount(postId, comment.section));

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
    const filters = {
      referenceId,
    };

    try {
      const {data} = await CommentAPI.loadComments(filters, {page: 1});

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

  const remove = async (comment: Comment) => {
    const deletedComment = await CommentAPI.remove(comment.id);

    setComments(prevComments =>
      prevComments.map(item => {
        if (item.id === comment.id) {
          item.deleteByUser = true;
        }

        return item;
      }),
    );

    if (deletedComment.post) {
      delay(
        deletedComment => {
          dispatch(updatePostMetric(deletedComment.postId, deletedComment.post.metric));
        },
        1000,
        deletedComment,
      );
    }
  };

  return {
    error,
    loading,
    comments,
    hasMoreComment: dataMeta.totalPageCount > dataMeta.currentPage,
    loadInitComment: load,
    loadMoreComment: loadMore,
    reply,
    updateUpvote,
    updateDownvote,
    updateRemoveUpvote,
    loadReplies,
    remove,
  };
};
