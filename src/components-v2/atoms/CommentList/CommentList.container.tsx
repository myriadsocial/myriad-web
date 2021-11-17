import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {CommentEditor} from '../CommentEditor/CommentEditor';
import {CommentList} from './CommentList';

import {debounce} from 'lodash';
import {useFriendList} from 'src/components-v2/FriendsMenu/hooks/use-friend-list.hook';
import {ReportContainer} from 'src/components-v2/Report';
import {SendTipContainer} from 'src/components-v2/SendTip';
import {TipHistoryContainer} from 'src/components-v2/TipHistory';
import {Modal} from 'src/components-v2/atoms/Modal';
import {useTipHistory} from 'src/hooks/tip-history.hook';
import {useCommentHook} from 'src/hooks/use-comment.hook';
import {Comment, CommentProps} from 'src/interfaces/comment';
import {SectionType, ReferenceType, Vote} from 'src/interfaces/interaction';
import {Post} from 'src/interfaces/post';
import {RootState} from 'src/reducers';
import {fetchFriend, searchFriend} from 'src/reducers/friend/actions';
import {FriendState} from 'src/reducers/friend/reducer';
import {upvote, downvote, removeVote} from 'src/reducers/timeline/actions';
import {UserState} from 'src/reducers/user/reducer';
import {setTippedUser, setTippedUserId} from 'src/reducers/wallet/actions';
import {WalletState} from 'src/reducers/wallet/reducer';

type CommentListContainerProps = {
  referenceId: string;
  placeholder?: string;
  section: SectionType;
  focus?: boolean;
  expand?: boolean;
};

export const CommentListContainer: React.FC<CommentListContainerProps> = props => {
  const {placeholder, referenceId, section, focus, expand} = props;

  const dispatch = useDispatch();
  const {
    comments,
    loadInitComment,
    reply,
    updateUpvote,
    updateDownvote,
    updateRemoveUpvote,
    loadReplies,
  } = useCommentHook(referenceId);
  const {openTipHistory} = useTipHistory();

  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const {friends} = useSelector<RootState, FriendState>(state => state.friendState);
  const downvoting = useSelector<RootState, Post | Comment | null>(
    state => state.timelineState.interaction.downvoting,
  );
  const {isTipSent} = useSelector<RootState, WalletState>(state => state.walletState);
  const [reported, setReported] = useState<Comment | null>(null);
  const [tippedComment, setTippedComment] = useState<Comment | null>(null);

  const sendTipOpened = Boolean(tippedComment);
  const mentionables = useFriendList(friends, user);

  useEffect(() => {
    if (user) {
      dispatch(fetchFriend(user));
    }
  }, [user]);

  useEffect(() => {
    if (isTipSent) {
      closeSendTip();
    }
  }, [isTipSent]);

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
    if (comment.isUpvoted) {
      dispatch(
        removeVote(comment, () => {
          updateRemoveUpvote(comment.id);
        }),
      );
    } else {
      dispatch(
        upvote(comment, section, (vote: Vote) => {
          updateUpvote(comment.id, comment.metric.upvotes + 1, vote);
        }),
      );
    }
  };

  const handleDownvote = (comment: Comment) => {
    if (comment.isDownVoted) {
      dispatch(
        removeVote(comment, () => {
          updateRemoveUpvote(comment.id);
        }),
      );
    } else {
      dispatch(
        downvote(comment, section, (vote: Vote) => {
          updateDownvote(comment.id, comment.metric.downvotes + 1, vote);
        }),
      );
    }
  };

  const handleSendTip = (reference: Post | Comment) => {
    // type guard to check if reference is a Comment object
    if ('section' in reference) {
      setTippedComment(reference);
      dispatch(setTippedUserId(reference.userId));
      dispatch(setTippedUser(reference.user.name, reference.user.profilePictureURL ?? ''));
    }
  };

  const closeSendTip = () => {
    if (isTipSent && tippedComment) {
      openTipHistory(tippedComment);
    } else {
      console.log('no comment tipped');
    }
    setTippedComment(null);
  };

  const handleReport = (comment: Comment) => {
    setReported(comment);
  };

  const closeReportPost = () => {
    setReported(null);
  };

  const handleSearchPeople = debounce((query: string) => {
    if (user) {
      dispatch(searchFriend(user, query));
    }
  }, 300);

  return (
    <>
      <CommentEditor
        referenceId={referenceId}
        placeholder={placeholder}
        user={user}
        expand={expand}
        mentionables={mentionables.map(item => ({
          value: item.id,
          name: item.name,
          avatar: item.avatar,
        }))}
        onSearchMention={handleSearchPeople}
        onSubmit={handleSubmitComment}
      />

      <CommentList
        user={user}
        comments={comments || []}
        mentionables={mentionables}
        placeholder={placeholder}
        onComment={handleSubmitComment}
        onDownvote={handleDownvote}
        onUpvote={handleUpvote}
        onLoadReplies={loadReplies}
        onOpenTipHistory={openTipHistory}
        focus={focus}
        expand={expand}
        onReport={handleReport}
        onSendTip={handleSendTip}
        onSearchPeople={handleSearchPeople}
      />

      <Modal
        gutter="none"
        open={sendTipOpened}
        onClose={closeSendTip}
        title="Send Tip"
        subtitle="Finding this post is insightful? Send a tip!">
        <SendTipContainer />
      </Modal>

      <TipHistoryContainer onSendTip={handleSendTip} />

      <ReportContainer reference={reported} onClose={closeReportPost} />
    </>
  );
};

export default CommentListContainer;
