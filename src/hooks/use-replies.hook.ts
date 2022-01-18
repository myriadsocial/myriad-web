import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {Comment, CommentProps} from 'src/interfaces/comment';
import {Vote} from 'src/interfaces/interaction';
import {User} from 'src/interfaces/user';
import * as CommentAPI from 'src/lib/api/comment';
import {ListMeta} from 'src/lib/api/interfaces/base-list.interface';
import {RootState} from 'src/reducers';
import {increaseCommentCount} from 'src/reducers/timeline/actions';
import {UserState} from 'src/reducers/user/reducer';

type useCommentHookProps = {
  error: any;
  loading: boolean;
  replies: Comment[];
  hasMoreReplies: boolean;
  replyComment: (user: User, comment: CommentProps, callback?: () => void) => void;
  updateUpvoteReplies: (commentId: string, total: number, vote: Vote) => void;
  updateDownvoteReplies: (commentId: string, total: number, vote: Vote) => void;
  updateRemoveUpvoteReplies: (commentId: string) => void;
  loadReplies: () => void;
  loadMoreReplies: () => void;
};

export const useRepliesHook = (referenceId: string, deep: number): useCommentHookProps => {
  const distpatch = useDispatch();
  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const [replies, setReplies] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [dataMeta, setDataMeta] = useState<ListMeta>({
    currentPage: 0,
    itemsPerPage: 0,
    totalItemCount: 0,
    totalPageCount: 0,
    nextPage: 0,
  });

  const reply = async (user: User, comment: CommentProps, callback?: () => void) => {
    const data = await CommentAPI.reply(comment);
    const postId = data.postId;

    // if replying post
    // if (comment.referenceId === referenceId) {
    //   setReplies(prevComments => [...prevComments, {...data, user}]);
    // } else {
    //   const newComment = replies.map(item => {
    //     if (item.id === data.referenceId) {
    //       item.replies?.push({...data, user});
    //     }

    //     if (item.replies) {
    //       item.replies.map(reply => {
    //         if (reply.id === data.referenceId) {
    //           reply.replies?.push({...data, user});
    //         }
    //         return reply;
    //       });
    //     }
    //     return item;
    //   });

      // setReplies(prevReplies => 
      //   ...prevReplies,
      //   data
      // )
    // }
    console.log('LOGGING REPLIES HOOK');
    console.log(referenceId, data.referenceId);
    setReplies(prevReplies => (
      [
        ...prevReplies,
        {...data, user}
      ]
    ))

    distpatch(increaseCommentCount(postId, comment.section));

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

    setReplies(prevComments => {
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

    setReplies(prevComments => {
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

    setReplies(prevComments => {
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

  const loadReplies = async () => {
    setLoading(true);
    try {
      const {data, meta} = await CommentAPI.loadComments(1, referenceId);
      const repliesData = data.map(comment => {
        const upvoted = comment.votes?.filter(vote => vote.userId === user?.id && vote.state);
        const downvoted = comment.votes?.filter(vote => vote.userId === user?.id && !vote.state);

        comment.isUpvoted = upvoted && upvoted.length > 0;
        comment.isDownVoted = downvoted && downvoted.length > 0;

        return comment;
      });

      setDataMeta(meta);
      setReplies(repliesData);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreReplies = async () => {
    setLoading(true);
    try {
      const {data, meta} = await CommentAPI.loadComments(dataMeta.nextPage ?? 1, referenceId);
      const repliesData = data.map(comment => {
        const upvoted = comment.votes?.filter(vote => vote.userId === user?.id && vote.state);
        const downvoted = comment.votes?.filter(vote => vote.userId === user?.id && !vote.state);

        comment.isUpvoted = upvoted && upvoted.length > 0;
        comment.isDownVoted = downvoted && downvoted.length > 0;

        return comment;
      });
      
      setDataMeta(meta);
      setReplies([
        ...replies,
        ...repliesData
      ])
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    error,
    loading,
    replies,
    hasMoreReplies: dataMeta.totalPageCount > dataMeta.currentPage,
    replyComment: reply,
    updateUpvoteReplies: updateUpvote,
    updateDownvoteReplies: updateDownvote,
    updateRemoveUpvoteReplies: updateRemoveUpvote,
    loadMoreReplies,
    loadReplies,
  };
};
