import React, {useEffect, useRef, forwardRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import Link from 'next/link';
import {useRouter} from 'next/router';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';

import {PromptComponent} from '../Prompt/prompt.component';
import {SendTipContainer} from 'src/components/SendTip';
import {Modal} from 'src/components/atoms/Modal';
import {ReportContainer} from 'src/components/Report';
import {CommentEditor} from '../CommentEditor';
import {CommentList} from '../CommentList';
import {VotingComponent} from '../Voting';
import {CommentDetailProps} from './CommentDetail.interface';
import {Comment} from 'src/interfaces/comment';
import {Post} from 'src/interfaces/post';
import {useStyles} from './CommentDetail.styles';
import {CommentRender} from './CommentRender';

import {formatDistance, subDays} from 'date-fns';
import ShowIf from 'src/components/common/show-if.component';
import {acronym} from 'src/helpers/string';
import {useFriendsHook} from 'src/hooks/use-friends-hook';
import {useRepliesHook} from 'src/hooks/use-replies.hook';
import {CommentProps} from 'src/interfaces/comment';
import {ReferenceType, Vote} from 'src/interfaces/interaction';
import {RootState} from 'src/reducers';
import {BalanceState} from 'src/reducers/balance/reducer';
import {WalletState} from 'src/reducers/wallet/reducer';
import {setTippedUser, setTippedUserId} from 'src/reducers/wallet/actions';
import {setTippedContent, upvote, downvote, removeVote, setDownvoting as setDownvotingReplies} from 'src/reducers/timeline/actions';

export const CommentDetail = forwardRef<HTMLDivElement, CommentDetailProps>((props, ref) => {
  const {
    section,
    comment,
    deep,
    user,
    mentionables,
    onUpvote,
    onReply,
    onLoadReplies,
    onOpenTipHistory,
    onReport,
    onSendTip,
    onSearchPeople,
    onRemoveVote,
    setDownvoting,
    onBeforeDownvote,
  } = props;

  const {
    replies,
    hasMoreReplies,
    replyComment,
    loadReplies,
    loadMoreReplies,
    updateUpvoteReplies,
    updateDownvoteReplies,
    updateRemoveUpvoteReplies
  } = useRepliesHook(comment.id, deep);

  const dispatch = useDispatch();
  const router = useRouter();
  
  console.log('DATA REPLIES = ',replies);

  const {balanceDetails} = useSelector<RootState, BalanceState>(state => state.balanceState);
  const editorRef = useRef<HTMLDivElement>(null);

  const style = useStyles();

  const [isReplying, setIsReplying] = React.useState(false);
  const [isBlocked, setIsBlocked] = React.useState(true);
  const {blocklistId, loadBlockListId} = useFriendsHook(user);
  const [maxLength, setMaxLength] = React.useState<number | undefined>(180);
  const [reported, setReported] = React.useState<Comment | null>(null);
  const [openSuccessPrompt, setOpenSuccessPrompt] = React.useState(false);
  const [tippedComment, setTippedComment] = React.useState<Comment | null>(null);
  const [tippedContentForHistory, setTippedContentForHistory] = React.useState<Comment | null>(null);
  const downvoting = useSelector<RootState, Post | Comment | null>(
    state => state.timelineState.interaction.downvoting,
  );
  const {isTipSent} = useSelector<RootState, WalletState>(state => state.walletState);

  const sendTipOpened = Boolean(tippedComment);

  useEffect(() => {
    handleLoadReplies();
  }, [comment]);

  useEffect(() => {
    loadBlockListId();
    handleIsBlocked();
    loadReplies();
  }, []);

  useEffect(() => {
    handleIsBlocked();
  }, [blocklistId]);

  useEffect(() => {
    if (isTipSent) {
      closeSendTipReplies();
    }
  }, [isTipSent]);

  const handleOpenReply = () => {
    if (!user) return;

    setIsReplying(!isReplying);
  };

  const handleLoadReplies = () => {
    onLoadReplies(comment.id, deep);
  };

  const handleDownVote = () => {
    if (!user) return;

    if (!comment.isDownVoted) {
      setDownvoting(comment);

      if (deep < 2) {
        handleOpenReply();
      }

      if (deep >= 2) {
        onBeforeDownvote && onBeforeDownvote();
      }
    } else {
      onRemoveVote(comment);
    }
  };

  const handleUpvote = () => {
    if (!user) return;

    onUpvote(comment);
  };

  const handleOpenTipHistory = () => {
    onOpenTipHistory(comment);
  };

  const handleReport = () => {
    onReport(comment);
  };

  const handleSendTip = () => {
    onSendTip(comment);
    const contentType = 'comment';
    const referenceId = comment.id;
    dispatch(setTippedContent(contentType, referenceId));
  };

  const handleSendReply = (attributes: Partial<CommentProps>) => {
    setIsReplying(false);

    onReply(attributes);
  };

  const handleViewProfile = () => {
    router.push(`/profile/${comment.userId}`);
  };

  const handleIsBlocked = () => {
    setIsBlocked(blocklistId.includes(comment.userId));
  };

  const handleOpenComment = () => {
    setIsBlocked(false);
  };

  const getDate = (commentDate: Date) => {
    const newFormat = formatDistance(subDays(new Date(commentDate), 0), new Date(), {
      addSuffix: true,
    });
    return newFormat;
  };

  const totalVote = () => {
    return comment.metric.upvotes - comment.metric.downvotes;
  };

  const handleUpvoteReplies = (replies: Comment) => {
    if (replies.isUpvoted) {
      handleRemoveVoteReplies(replies);
    } else {
      dispatch(
        upvote(replies, section, (vote: Vote) => {
          updateUpvoteReplies(replies.id, replies.metric.upvotes + 1, vote);
        }),
      );
    }
  };

  const handleRemoveVoteReplies = (replies: Comment) => {
    dispatch(
      removeVote(replies, () => {
        updateRemoveUpvoteReplies(replies.id);
      }),
    );
  };

  const handleSubmitCommentReplies = (replyItem: Partial<CommentProps>) => {
    // TODO
    console.log('handle submit comment replies');
    if (user) {
      replyComment(
        user,
        {
          ...replyItem,
          postId: comment.postId,
          referenceId: replyItem.referenceId, 
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
                  updateDownvoteReplies(downvoting.id, downvoting.metric.downvotes + 1, vote);
                }
              }),
            );
          }
        },
      );
    }
  };

  const handleSetDownvotingReplies = (replyItem: Comment) => {
    dispatch(setDownvotingReplies(replyItem));
  };

  const handleReportReplies = (replyItem: Comment) => {
    setReported(replyItem);
  };

  const closeReportPostReplies = () => {
    setReported(null);
  };

  const handleCloseSuccessPrompt = (): void => {
    setOpenSuccessPrompt(false);
  };

  const handleSendTipReplies = (reference: Post | Comment) => {
    // type guard to check if reference is a Comment object
    if ('section' in reference) {
      setTippedComment(reference);
      dispatch(setTippedUserId(reference.userId));
      dispatch(setTippedUser(reference.user.name, reference.user.profilePictureURL ?? ''));
    }
  };

  const closeSendTipReplies = () => {
    console.log(isTipSent);
    console.log(tippedComment);
    if (isTipSent && tippedComment) {
      setOpenSuccessPrompt(true);
      setTippedContentForHistory(tippedComment);
    } else {
      console.log('no comment tipped');
    }
    setTippedComment(null);
  };

  const handleOpenTipHistoryReplies = (): void => {
    if (tippedContentForHistory) {
      onOpenTipHistory(tippedContentForHistory);
      setOpenSuccessPrompt(false);
    }
  };

  const owner = comment.userId === user?.id;

  return (
    <div className={style.flex} ref={ref}>
      <div className={style.tree}>
        <Avatar
          className={style.avatar}
          src={comment.user?.profilePictureURL || ''}
          onClick={handleViewProfile}>
          {acronym(comment.user?.name)}
        </Avatar>
        {deep !== 2 && comment.replies && <div className={style.verticalTree} />}
        {deep !== 0 && <div className={style.horizontalTree} />}
      </div>
      <div className={style.fullWidth}>
        <Card className={style.comment}>
          <ShowIf condition={isBlocked}>
            <CardHeader
              title={
                <div className={style.flexSpaceBetween}>
                  <div>
                    <Link href={`/profile/${comment.user.id}`}>
                      <Typography
                        variant="body1"
                        className={style.link}
                        component="a"
                        href={`/profile/${comment.user.id}`}>
                        Blocked user
                      </Typography>
                    </Link>

                    <Typography variant="caption" color="textSecondary">
                      <span className={style.dot}>•</span>
                      {getDate(comment.createdAt)}
                    </Typography>
                  </div>

                  <Typography
                    variant="body1"
                    className={style.cursor}
                    color="primary"
                    onClick={handleOpenComment}>
                    show comment
                  </Typography>
                </div>
              }
            />
          </ShowIf>
          <ShowIf condition={!isBlocked}>
            <CardHeader
              title={
                <>
                  <Link href={`/profile/${comment.user.id}`}>
                    <Typography
                      variant="body1"
                      className={style.link}
                      component="a"
                      href={`/profile/${comment.user.id}`}>
                      {comment.user.name}
                    </Typography>
                  </Link>

                  <Typography variant="caption" color="textSecondary">
                    <span className={style.dot}>•</span>
                    {getDate(comment.createdAt)}
                  </Typography>
                </>
              }
            />
            <CardContent className={style.content}>
              <CommentRender
                comment={comment}
                max={maxLength}
                onShowAll={() => setMaxLength(undefined)}
              />
            </CardContent>
            <CardActions disableSpacing>
              <VotingComponent
                isUpVote={Boolean(comment.isUpvoted)}
                isDownVote={Boolean(comment.isDownVoted)}
                variant="row"
                vote={totalVote()}
                size="small"
                onDownVote={handleDownVote}
                onUpvote={handleUpvote}
              />
              {deep < 2 && (
                <Button
                  disabled={!user}
                  onClick={handleOpenReply}
                  classes={{root: style.button}}
                  size="small"
                  variant="text">
                  Reply
                </Button>
              )}

              <ShowIf condition={!owner}>
                <Button
                  disabled={balanceDetails.length === 0}
                  classes={{root: style.button}}
                  size="small"
                  variant="text"
                  onClick={handleSendTip}>
                  Send tip
                </Button>
              </ShowIf>

              <Button
                classes={{root: style.button}}
                size="small"
                variant="text"
                onClick={handleOpenTipHistory}>
                Tip history
              </Button>
              <Button
                disabled={!user}
                classes={{root: style.button}}
                size="small"
                variant="text"
                onClick={handleReport}>
                Report
              </Button>
            </CardActions>
          </ShowIf>
        </Card>
        {user && isReplying && (
          <CommentEditor
            ref={editorRef}
            referenceId={comment.id}
            type={ReferenceType.COMMENT}
            user={user}
            mentionables={mentionables.map(item => ({
              value: item.id,
              name: item.name,
              avatar: item.avatar,
            }))}
            onSearchMention={onSearchPeople}
            onSubmit={handleSendReply}
          />
        )}
        {comment && (
          <CommentList
            section={section}
            user={user}
            deep={deep + 1}
            onUpvote={onUpvote}
            onUpvoteReplies={handleUpvoteReplies}
            onRemoveVote={onRemoveVote}
            onRemoveVoteReplies={handleRemoveVoteReplies}
            comments={replies || []}
            onComment={onReply}
            onCommentReplies={handleSubmitCommentReplies}
            onLoadReplies={onLoadReplies}
            onOpenTipHistory={onOpenTipHistory}
            onReport={onReport}
            onReportReplies={handleReportReplies}
            onSendTip={onSendTip}
            onSendTipReplies={handleSendTipReplies}
            mentionables={mentionables}
            onSearchPeople={onSearchPeople}
            setDownvoting={setDownvoting}
            setDownvotingReplies={handleSetDownvotingReplies}
            onBeforeDownvote={handleOpenReply}
            hasMoreReplies={hasMoreReplies}
            onLoadMoreReplies={loadMoreReplies}
          />
        )}
      </div>

      <Modal
        gutter="none"
        open={sendTipOpened}
        onClose={closeSendTipReplies}
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

      <ReportContainer reference={reported} onClose={closeReportPostReplies} />
    </div>
  );
});
