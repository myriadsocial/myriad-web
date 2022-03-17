import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {Comment, CommentProps} from 'src/interfaces/comment';
import {Vote} from 'src/interfaces/interaction';
import {User} from 'src/interfaces/user';
import * as CommentAPI from 'src/lib/api/comment';
import {ListMeta} from 'src/lib/api/interfaces/base-list.interface';
import {RootState} from 'src/reducers';
import {increaseCommentCount, updatePostMetric} from 'src/reducers/timeline/actions';
import {UserState} from 'src/reducers/user/reducer';

type useCommentHookProps = {
  error: any;
  loading: boolean;
  replies: Comment[];
  hasMoreReplies: boolean;
  reply: (user: User, comment: CommentProps, callback?: () => void) => void;
  updateReplyUpvote: (commentId: string, total: number, vote: Vote) => void;
  updateReplyDownvote: (commentId: string, total: number, vote: Vote) => void;
  removeReplyVote: (commentId: string) => void;
  loadReplies: () => void;
  loadMoreReplies: () => void;
  removeReply: (comment: Comment) => void;
};

export const useRepliesHook = (referenceId: string, deep: number): useCommentHookProps => {
  const dispatch = useDispatch();
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
    data.isUpvoted = false;
    data.isDownVoted = false;
    data.votes = [];

    const postId = data.postId;

    setReplies(prevReplies => [{...data, user}, ...prevReplies]);

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

    setReplies(prevComments => {
      return prevComments.map(comment => {
        comment = modifyVotes(comment);

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

    setReplies(prevReplies => {
      return prevReplies.map(comment => {
        comment = modifyVotes(comment);

        return comment;
      });
    });
  };

  const updateRemoveVote = (commentId: string) => {
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

    setReplies(prevReplies => {
      return prevReplies.map(comment => {
        comment = modifyVotes(comment);

        return comment;
      });
    });
  };

  const loadReplies = async () => {
    setLoading(true);

    const filters = {
      referenceId,
    };

    try {
      const {data, meta} = await CommentAPI.loadComments(filters, {page: 1});
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

    const filters = {
      referenceId,
    };

    try {
      const {data, meta} = await CommentAPI.loadComments(filters, {page: dataMeta.nextPage ?? 1});
      const repliesData = data.map(comment => {
        const upvoted = comment.votes?.filter(vote => vote.userId === user?.id && vote.state);
        const downvoted = comment.votes?.filter(vote => vote.userId === user?.id && !vote.state);

        comment.isUpvoted = upvoted && upvoted.length > 0;
        comment.isDownVoted = downvoted && downvoted.length > 0;

        return comment;
      });

      setDataMeta(meta);
      setReplies([...replies, ...repliesData]);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const removeReply = async (comment: Comment) => {
    const deletedComment = await CommentAPI.remove(comment.id);

    setReplies(prevReplies =>
      prevReplies.map(item => {
        if (item.id === comment.id) {
          item.deleteByUser = true;
        }

        return item;
      }),
    );

    if (deletedComment.post) {
      dispatch(updatePostMetric(deletedComment.postId, deletedComment.post.metric));
    }
  };

  return {
    error,
    loading,
    replies,
    hasMoreReplies: dataMeta.totalPageCount > dataMeta.currentPage,
    reply: reply,
    updateReplyUpvote: updateUpvote,
    updateReplyDownvote: updateDownvote,
    removeReplyVote: updateRemoveVote,
    loadMoreReplies,
    loadReplies,
    removeReply,
  };
};
