import {DotsVerticalIcon, GiftIcon} from '@heroicons/react/outline';

import React, {useEffect, forwardRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import Link from 'next/link';
import {useRouter} from 'next/router';

import {IconButton, Menu, MenuItem, SvgIcon, useMediaQuery, useTheme} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';

import {CommentList} from '../CommentList';
import {Avatar, AvatarSize} from '../atoms/Avatar';
import {VotingComponent} from '../atoms/Voting';
import useConfirm from '../common/Confirm/use-confirm.hook';
import {SendTipButton} from '../common/SendTipButton/SendTipButton';
import {TimeAgo} from '../common/TimeAgo.component';
import {CommentDetailProps} from './CommentDetail.interface';
import {useStyles} from './CommentDetail.styles';

import CommentEditor from 'components/CommentEditor/CommentEditor.container';
import {NodeViewer} from 'components/common/NodeViewer';
import ShowIf from 'src/components/common/show-if.component';
import {useRepliesHook} from 'src/hooks/use-replies.hook';
import {Comment} from 'src/interfaces/comment';
import {CommentProps} from 'src/interfaces/comment';
import {ReferenceType, Vote} from 'src/interfaces/interaction';
import {Post} from 'src/interfaces/post';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';
import {
  upvote,
  downvote,
  removeVote,
  setDownvoting,
  resetDownvoting,
} from 'src/reducers/timeline/actions';

export const CommentDetail = forwardRef<HTMLDivElement, CommentDetailProps>((props, ref) => {
  const {
    section,
    comment,
    deep,
    user,
    mentionables,
    blockedUserIds,
    onUpvote,
    onRemoveVote,
    onUpdateDownvote,
    onOpenTipHistory,
    onReport,
    onSearchPeople,
    onDelete,
    scrollToPost,
  } = props;

  const {
    replies,
    hasMoreReplies,
    reply,
    loadReplies,
    loadMoreReplies,
    updateReplyUpvote,
    updateReplyDownvote,
    removeReplyVote,
    removeReply,
  } = useRepliesHook(comment.id, deep);

  const dispatch = useDispatch();
  const style = useStyles({...props, deep});
  const router = useRouter();
  const confirm = useConfirm();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  const downvoting = useSelector<RootState, Post | Comment | null>(
    state => state.timelineState.interaction.downvoting,
  );

  const [menuAnchorElement, setMenuAnchorElement] = React.useState<null | HTMLElement>(null);
  const [isReplying, setIsReplying] = React.useState(false);
  const [isBlocked, setIsBlocked] = React.useState(blockedUserIds.includes(comment.userId));
  const banned = Boolean(user?.deletedAt);
  const totalVote = comment.metric.upvotes - comment.metric.downvotes;
  const isOwnComment = comment.userId === user?.id;

  useEffect(() => {
    if (comment.metric.comments > 0 || comment.metric.deletedComments > 0) {
      loadReplies(section);
    }
  }, [comment.metric.comments]);

  const handleOpenReply = () => {
    if (!user) return;

    setIsReplying(!isReplying);
  };

  const handleSubmitComment = (attributes: Partial<CommentProps>) => {
    if (user) {
      setIsReplying(false);

      const value = {
        ...attributes,
        section,
        userId: user.id,
        postId: comment.postId,
      } as CommentProps;

      reply(user, value, () => {
        if (downvoting && downvoting.id === comment.id) {
          dispatch(
            downvote(comment, section, (vote: Vote) => {
              // update parent downvote if downvoting on reply
              if ('section' in downvoting) {
                onUpdateDownvote(downvoting.id, downvoting.metric.downvotes + 1, vote);
              }
            }),
          );
        }
      });
    }
  };

  const handleUpvote = () => {
    if (!user) return;

    onUpvote(comment);
  };

  const handleDownVote = () => {
    if (!user) return;

    if (comment.id === downvoting?.id) {
      dispatch(resetDownvoting());

      handleOpenReply();
    } else {
      if (!comment.isDownVoted) {
        dispatch(setDownvoting(comment));

        handleOpenReply();
      } else {
        onRemoveVote(comment);
      }
    }
  };

  const handleRepliesUpvote = (comment: Comment) => {
    if (comment.isUpvoted) {
      handleRepliesRemoveVote(comment);
    } else {
      dispatch(
        upvote(comment, section, (vote: Vote) => {
          updateReplyUpvote(comment.id, comment.metric.upvotes + 1, vote);
        }),
      );
    }
  };

  const handleRepliesRemoveVote = (comment: Comment) => {
    dispatch(
      removeVote(comment, () => {
        removeReplyVote(comment.id);
      }),
    );
  };

  const handleClickSettings = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setMenuAnchorElement(e.currentTarget);
  };

  const handleCloseSettings = () => {
    setMenuAnchorElement(null);
  };

  const handleOpenTipHistory = () => {
    onOpenTipHistory(comment);

    handleCloseSettings();
  };

  const handleReport = () => {
    onReport(comment);

    handleCloseSettings();
  };

  const handleViewProfile = () => {
    router.push(`/profile/${comment.userId}`);
  };

  const handleOpenComment = () => {
    setIsBlocked(false);
  };

  const showConfirmDeleteDialog = (reply: Comment) => {
    confirm({
      title: i18n.t('Post_Comment.Confirm_Delete.Title'),
      description: i18n.t('Post_Comment.Confirm_Delete.Description'),
      icon: 'danger',
      confirmationText: i18n.t('Post_Comment.Confirm_Delete.Confirm_Text'),
      cancellationText: i18n.t('Post_Comment.Confirm_Delete.Cancel_Text'),
      onConfirm: () => {
        if (reply.id === comment.id) {
          onDelete(comment);
        } else {
          removeReply(reply);
        }
      },
    });
  };

  const handleLoadMoreReplies = (): void => {
    loadMoreReplies(section);
  };

  return (
    <>
      <div className={style.flex} ref={ref} id={`comment-${comment.id}-deep-${deep}`}>
        <div className={style.tree}>
          <Avatar
            name={comment.user?.name}
            src={comment.user?.profilePictureURL}
            size={isMobile ? AvatarSize.TINY : AvatarSize.MEDIUM}
            onClick={handleViewProfile}
          />
          {(deep === 0 || deep > 2 || replies.length > 0) && <div className={style.verticalTree} />}
          {deep > 0 && deep <= 2 && <div className={style.horizontalTree} />}
        </div>
        <div className={style.fullWidth}>
          <Card className={style.comment}>
            <ShowIf condition={isBlocked}>
              <CardHeader
                title={
                  <div className={style.flexSpaceBetween}>
                    <div>
                      <Link
                        href={'/profile/[id]'}
                        as={`/profile/${comment.user.id}`}
                        shallow
                        passHref>
                        <Typography variant="body1" className={style.link} component="a">
                          {i18n.t('Post_Comment.Blocked_User')}
                        </Typography>
                      </Link>

                      <Typography variant="caption" color="textSecondary">
                        <span className={style.dot}>•</span>
                        <TimeAgo date={comment.createdAt} />
                      </Typography>
                    </div>

                    <Typography
                      variant="body1"
                      className={style.cursor}
                      color="primary"
                      onClick={handleOpenComment}>
                      {i18n.t('Post_Comment.Show_Comment')}
                    </Typography>
                  </div>
                }
              />
            </ShowIf>
            <ShowIf condition={!isBlocked}>
              <CardHeader
                title={
                  <>
                    <Link
                      href={'/profile/[id]'}
                      as={`/profile/${comment.user.id}`}
                      shallow
                      passHref>
                      <Typography variant="body1" className={style.link} component="a">
                        {comment?.user?.deletedAt
                          ? i18n.t('Post_Comment.User_Banned')
                          : comment.user.name}
                      </Typography>
                    </Link>

                    <Typography variant="caption" color="textSecondary">
                      <span className={style.dot}>•</span>
                      <TimeAgo date={comment.createdAt} />
                    </Typography>
                  </>
                }
              />
              <CardContent className={style.content}>
                <NodeViewer id={comment.id} text={comment.text} />
                {comment.asset?.exclusiveContents && comment.asset?.exclusiveContents.length > 0 && (
                  <Button
                    size="small"
                    className={style.buttonExclusive}
                    variant="contained"
                    startIcon={
                      <SvgIcon
                        component={GiftIcon}
                        viewBox="0 0 24 24"
                        className={style.giftIcon}
                      />
                    }>
                    {i18n.t('ExclusiveContent.Available')}
                  </Button>
                )}
              </CardContent>
              <CardActions disableSpacing>
                <VotingComponent
                  isUpVoted={Boolean(comment.isUpvoted)}
                  isDownVoted={Boolean(comment.isDownVoted)}
                  variant="row"
                  vote={totalVote}
                  size="small"
                  onDownVote={handleDownVote}
                  onUpvote={handleUpvote}
                />

                <Button
                  classes={{root: style.button}}
                  disabled={!user}
                  onClick={handleOpenReply}
                  size="small"
                  variant="text">
                  {i18n.t('Post_Comment.Reply')}
                </Button>

                <ShowIf condition={!isOwnComment}>
                  <SendTipButton
                    reference={comment}
                    referenceType={ReferenceType.COMMENT}
                    size="small"
                    variant="text"
                    classes={{root: style.button}}
                  />
                </ShowIf>

                <ShowIf condition={!isMobile}>
                  <Button
                    classes={{root: style.button}}
                    size="small"
                    variant="text"
                    onClick={handleOpenTipHistory}>
                    {i18n.t('Post_Comment.Tip_History')}
                  </Button>
                  <ShowIf condition={!isOwnComment}>
                    <Button
                      classes={{root: style.button}}
                      disabled={!user}
                      size="small"
                      variant="text"
                      onClick={handleReport}>
                      {i18n.t('Post_Comment.Report')}
                    </Button>
                  </ShowIf>
                  <ShowIf condition={isOwnComment}>
                    <Button
                      classes={{root: style.button}}
                      size="small"
                      variant="text"
                      onClick={() => onDelete(comment)}>
                      {i18n.t('Post_Comment.Delete')}
                    </Button>
                  </ShowIf>
                </ShowIf>

                <ShowIf condition={isMobile}>
                  <div style={{marginLeft: 'auto'}}>
                    <IconButton aria-label="settings" onClick={handleClickSettings}>
                      <SvgIcon component={DotsVerticalIcon} viewBox="0 0 24 24" />
                    </IconButton>

                    <Menu
                      anchorEl={menuAnchorElement}
                      getContentAnchorEl={null}
                      anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                      transformOrigin={{vertical: 'bottom', horizontal: 'center'}}
                      open={Boolean(menuAnchorElement)}
                      onClose={handleCloseSettings}>
                      <MenuItem onClick={handleOpenTipHistory}>
                        {i18n.t('Post_Comment.Tip_History')}
                      </MenuItem>
                      <ShowIf condition={!isOwnComment}>
                        <MenuItem onClick={handleReport}> {i18n.t('Post_Comment.Report')}</MenuItem>
                      </ShowIf>
                      <ShowIf condition={isOwnComment}>
                        <MenuItem onClick={() => onDelete(comment)}>
                          {' '}
                          {i18n.t('Post_Comment.Delete')}
                        </MenuItem>
                      </ShowIf>
                    </Menu>
                  </div>
                </ShowIf>
              </CardActions>
            </ShowIf>
          </Card>
        </div>
      </div>

      <div id={`replies-${deep}`} style={{marginLeft: deep < 2 ? 64 : 0}}>
        {user && !banned && isReplying && (
          <CommentEditor
            referenceId={comment.id}
            section={comment.section}
            type={ReferenceType.COMMENT}
            user={user}
            onSubmit={handleSubmitComment}
          />
        )}

        <CommentList
          section={section}
          user={user}
          mentionables={mentionables}
          blockedUserIds={blockedUserIds}
          deep={deep + 1}
          comments={replies || []}
          hasMoreComment={hasMoreReplies}
          onLoadMoreComments={handleLoadMoreReplies}
          onUpvote={handleRepliesUpvote}
          onRemoveVote={handleRepliesRemoveVote}
          onUpdateDownvote={updateReplyDownvote}
          onReportReplies={handleReport}
          onReport={onReport}
          onSearchPeople={onSearchPeople}
          onDelete={showConfirmDeleteDialog}
          scrollToPost={scrollToPost}
        />
      </div>
    </>
  );
});

CommentDetail.displayName = 'CommentDetail';
