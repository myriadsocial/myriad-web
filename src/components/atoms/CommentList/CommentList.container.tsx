import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import {CommentEditor} from '../CommentEditor/CommentEditor';
import {PromptComponent} from '../Prompt/prompt.component';
import {CommentList} from './CommentList';

import {debounce} from 'lodash';
import {useFriendList} from 'src/components/FriendsMenu/hooks/use-friend-list.hook';
import {ReportContainer} from 'src/components/Report';
import {SendTipContainer} from 'src/components/SendTip';
import {TipHistoryContainer} from 'src/components/TipHistory';
import {Modal} from 'src/components/atoms/Modal';
import ShowIf from 'src/components/common/show-if.component';
import {useTipHistory} from 'src/hooks/tip-history.hook';
import {useCommentHook} from 'src/hooks/use-comment.hook';
import {Comment, CommentProps} from 'src/interfaces/comment';
import {SectionType, ReferenceType, Vote} from 'src/interfaces/interaction';
import {Post} from 'src/interfaces/post';
import {RootState} from 'src/reducers';
import {fetchFriend, searchFriend} from 'src/reducers/friend/actions';
import {FriendState} from 'src/reducers/friend/reducer';
import {downvote, removeVote, upvote} from 'src/reducers/timeline/actions';
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
    hasMoreComment,
    loadInitComment,
    reply,
    updateDownvote: updateDownpipe,
    loadMoreComment,
    updateUpvote,
    updateRemoveUpvote,
  } = useCommentHook(referenceId);
  const {openTipHistory} = useTipHistory();

  const {user, anonymous} = useSelector<RootState, UserState>(state => state.userState);
  const {friends} = useSelector<RootState, FriendState>(state => state.friendState);
  const downvoting = useSelector<RootState, Post | Comment | null>(
    state => state.timelineState.interaction.downvoting,
  );
  const {isTipSent} = useSelector<RootState, WalletState>(state => state.walletState);
  const [reported, setReported] = useState<Comment | null>(null);
  const [tippedComment, setTippedComment] = useState<Comment | null>(null);
  const [tippedContentForHistory, setTippedContentForHistory] = useState<Comment | null>(null);
  const [openSuccessPrompt, setOpenSuccessPrompt] = useState(false);

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
            dispatch(
              downvote(downvoting, section, (vote: Vote) => {
                // update vote count if reference is a comment
                if ('section' in downvoting) {
                  updateDownpipe(downvoting.id, downvoting.metric.downvotes + 1, vote);
                }
              }),
            );
          }
        },
      );
    }
  };

  const handleUpvote = (comment: Comment) => {
    if (comment.isUpvoted) {
      handleRemoveVote(comment);
    } else {
      dispatch(
        upvote(comment, section, (vote: Vote) => {
          updateUpvote(comment.id, comment.metric.upvotes + 1, vote);
        }),
      );
    }
  };

  const handleRemoveVote = (comment: Comment) => {
    dispatch(
      removeVote(comment, () => {
        updateRemoveUpvote(comment.id);
      }),
    );
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
      setOpenSuccessPrompt(true);
      setTippedContentForHistory(tippedComment);
    } else {
      console.log('no comment tipped');
    }
    setTippedComment(null);
  };

  const handleCloseSuccessPrompt = (): void => {
    setOpenSuccessPrompt(false);
  };

  const handleOpenTipHistory = (): void => {
    if (tippedContentForHistory) {
      openTipHistory(tippedContentForHistory);
      setOpenSuccessPrompt(false);
    }
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

  const handleLoadMoreComment = (): void => {
    loadMoreComment();
  };

  return (
    <>
      <ShowIf condition={!anonymous}>
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
      </ShowIf>

      <CommentList
        section={section}
        user={user}
        comments={comments || []}
        mentionables={mentionables}
        placeholder={placeholder}
        focus={focus}
        expand={expand}
        hasMoreComment={hasMoreComment}
        onUpvote={handleUpvote}
        onRemoveVote={handleRemoveVote}
        onReport={handleReport}
        onSendTip={handleSendTip}
        onOpenTipHistory={openTipHistory}
        onLoadMoreReplies={console.log}
        onSearchPeople={handleSearchPeople}
      />

      <ShowIf condition={hasMoreComment}>
        <div style={{marginLeft: '69px', cursor: 'pointer'}} onClick={handleLoadMoreComment}>
          <Typography color="primary">View more comments</Typography>
        </div>
      </ShowIf>

      <Modal
        gutter="none"
        open={sendTipOpened}
        onClose={closeSendTip}
        title="Send Tip"
        subtitle="Find this user insightful? Send a tip!">
        <SendTipContainer />
      </Modal>

      <PromptComponent
        icon={'success'}
        open={openSuccessPrompt}
        onCancel={handleCloseSuccessPrompt}
        title={'Success'}
        subtitle={
          <Typography component="div">
            Tip to{' '}
            <Box fontWeight={400} display="inline">
              {tippedContentForHistory?.user.name ?? 'Unknown Myrian'}
            </Box>{' '}
            sent successfully
          </Typography>
        }>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}>
          <Button
            style={{marginRight: '12px'}}
            size="small"
            variant="outlined"
            color="secondary"
            onClick={handleOpenTipHistory}>
            See tip history
          </Button>
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={handleCloseSuccessPrompt}>
            Return
          </Button>
        </div>
      </PromptComponent>

      <TipHistoryContainer onSendTip={handleSendTip} />

      <ReportContainer reference={reported} onClose={closeReportPost} />
    </>
  );
};

export default CommentListContainer;
