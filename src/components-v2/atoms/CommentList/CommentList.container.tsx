import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {RootState} from '../../../reducers';
import {upvote, downvote} from '../../../reducers/timeline/actions';
import {TipHistory} from '../../TipHistory';
import {CommentList} from './CommentList';

import {useCommentHook} from 'src/hooks/use-comment.hook';
import {Comment, CommentProps} from 'src/interfaces/comment';
import {CurrencyId} from 'src/interfaces/currency';
import {SectionType, ReferenceType} from 'src/interfaces/interaction';
import {Post} from 'src/interfaces/post';
import {TransactionSort} from 'src/interfaces/transaction';
import {
  fetchTransactionHistory,
  clearTippedContent,
  setTransactionCurrency,
  setTransactionSort,
} from 'src/reducers/tip-summary/actions';
import {TipSummaryState} from 'src/reducers/tip-summary/reducer';
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

  const {user, currencies} = useSelector<RootState, UserState>(state => state.userState);
  const downvoting = useSelector<RootState, Post | Comment | null>(
    state => state.timelineState.interaction.downvoting,
  );
  const {transactions} = useSelector<RootState, TipSummaryState>(state => state.tipSummaryState);

  const [tipHistoryReference, setTipHistoryReference] = useState<Comment | null>(null);
  const isTipHistoryOpen = Boolean(tipHistoryReference);

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

  const openTipHistory = (reference: Comment) => {
    dispatch(fetchTransactionHistory(reference, 'comment'));

    setTipHistoryReference(reference);
  };

  const handleSendTip = () => {
    closeTipHistory();
  };

  const closeTipHistory = () => {
    setTipHistoryReference(null);
    dispatch(clearTippedContent());
  };

  const handleSortTransaction = (sort: TransactionSort) => {
    dispatch(setTransactionSort(sort));

    if (tipHistoryReference) {
      dispatch(fetchTransactionHistory(tipHistoryReference, 'comment'));
    }
  };

  const handleFilterTransaction = (currency: CurrencyId) => {
    dispatch(setTransactionCurrency(currency));

    if (tipHistoryReference) {
      dispatch(fetchTransactionHistory(tipHistoryReference, 'comment'));
    }
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
