import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {RootState} from '../../../reducers';
import {upvote, downvote} from '../../../reducers/timeline/actions';
import {TipHistory} from '../../TipHistory';
import {CommentList} from './CommentList';

import {useTipHistory} from 'src/hooks/tip-history.hook';
import {useCommentHook} from 'src/hooks/use-comment.hook';
import {Comment, CommentProps} from 'src/interfaces/comment';
import {SectionType, ReferenceType} from 'src/interfaces/interaction';
import {Post} from 'src/interfaces/post';
import {UserState} from 'src/reducers/user/reducer';

type CommentListContainerProps = {
  referenceId: string;
  placeholder?: string;
  section: SectionType;
};

export const CommentListContainer: React.FC<CommentListContainerProps> = props => {
  const {placeholder, referenceId, section} = props;

  const dispatch = useDispatch();
  const {comments, loadInitComment, reply, updateUpvote, updateDownvote, loadReplies} =
    useCommentHook(referenceId);
  const {
    isTipHistoryOpen,
    transactions,
    closeTipHistory,
    handleFilterTransaction,
    handleSortTransaction,
    openTipHistory,
  } = useTipHistory();

  const {user, currencies} = useSelector<RootState, UserState>(state => state.userState);
  const downvoting = useSelector<RootState, Post | Comment | null>(
    state => state.timelineState.interaction.downvoting,
  );

  useEffect(() => {
    loadInitComment(section);
  }, [referenceId]);

  const handleSubmitComment = (comment: Partial<CommentProps>) => {
    if (user) {
      reply(
        user,
        {
          ...comment,
          postId: referenceId,
          referenceId: comment.referenceId ?? referenceId,
          type: comment.type ?? ReferenceType.POST,
          userId: user.id,
          section: comment.section ?? section,
        } as CommentProps,
        () => {
          if (downvoting) {
            dispatch(downvote(downvoting, section));
          }
        },
      );
    }
  };

  const handleUpvote = (comment: Comment) => {
    dispatch(
      upvote(comment, section, () => {
        updateUpvote(comment.id, comment.metric.upvotes + 1);
      }),
    );
  };

  const handleDownvote = (comment: Comment) => {
    dispatch(
      downvote(comment, section, () => {
        updateDownvote(comment.id, comment.metric.upvotes - 1);
      }),
    );
  };

  const handleSendTip = () => {
    closeTipHistory();
  };

  return (
    <>
      <CommentList
        user={user}
        comments={comments || []}
        placeholder={placeholder}
        onComment={handleSubmitComment}
        onDownvote={handleDownvote}
        onUpvote={handleUpvote}
        onLoadReplies={loadReplies}
        onOpenTipHistory={openTipHistory}
      />

      <TipHistory
        open={isTipHistoryOpen}
        currencies={currencies}
        tips={transactions}
        sendTip={handleSendTip}
        onClose={closeTipHistory}
        onSort={handleSortTransaction}
        onFilter={handleFilterTransaction}
      />
    </>
  );
};
