import React, {useEffect, useRef, forwardRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import Link from 'next/link';
import {useRouter} from 'next/router';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';

import {CommentEditor} from '../CommentEditor';
import {CommentList} from '../CommentList';
import {VotingComponent} from '../Voting';
import {CommentDetailProps} from './CommentDetail.interface';
import {useStyles} from './CommentDetail.styles';
import {CommentRender} from './CommentRender';

import {formatDistance, subDays} from 'date-fns';
import ShowIf from 'src/components/common/show-if.component';
import {acronym} from 'src/helpers/string';
import {useFriendsHook} from 'src/hooks/use-friends-hook';
import {useRepliesHook} from 'src/hooks/use-replies.hook';
import {Comment} from 'src/interfaces/comment';
import {CommentProps} from 'src/interfaces/comment';
import {ReferenceType, Vote} from 'src/interfaces/interaction';
import {Post} from 'src/interfaces/post';
import {RootState} from 'src/reducers';
import {BalanceState} from 'src/reducers/balance/reducer';
import {
  setTippedContent,
  upvote,
  downvote,
  removeVote,
  setDownvoting,
} from 'src/reducers/timeline/actions';

export const CommentDetail = forwardRef<HTMLDivElement, CommentDetailProps>((props, ref) => {
  const {
    section,
    comment,
    deep,
    user,
    mentionables,
    onUpvote,
    onRemoveVote,
    onOpenTipHistory,
    onReport,
    onSendTip,
    onSearchPeople,
    onBeforeDownvote,
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
  } = useRepliesHook(comment.id, deep);

  const dispatch = useDispatch();
  const style = useStyles();
  const router = useRouter();

  const {balanceDetails} = useSelector<RootState, BalanceState>(state => state.balanceState);
  const downvoting = useSelector<RootState, Post | Comment | null>(
    state => state.timelineState.interaction.downvoting,
  );

  const editorRef = useRef<HTMLDivElement>(null);

  const [isReplying, setIsReplying] = React.useState(false);
  const [isBlocked, setIsBlocked] = React.useState(true);
  const {blocklistId, loadBlockListId} = useFriendsHook(user);
  const [maxLength, setMaxLength] = React.useState<number | undefined>(180);

  useEffect(() => {
    loadBlockListId();
    loadReplies();
  }, []);

  useEffect(() => {
    handleIsBlocked();
  }, [blocklistId]);

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
              // update vote count if reference is a comment
              if ('section' in downvoting) {
                updateReplyDownvote(downvoting.id, downvoting.metric.downvotes + 1, vote);
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
            onSubmit={handleSubmitComment}
          />
        )}

        {comment && (
          <CommentList
            section={section}
            user={user}
            deep={deep + 1}
            comments={replies || []}
            onUpvote={handleRepliesUpvote}
            onRemoveVote={handleRepliesRemoveVote}
            onOpenTipHistory={onOpenTipHistory}
            onReport={onReport}
            onReportReplies={handleReport}
            onSendTip={onSendTip}
            onSendTipReplies={handleSendTip}
            mentionables={mentionables}
            onSearchPeople={onSearchPeople}
            onBeforeDownvote={handleOpenReply}
            hasMoreComment={hasMoreReplies}
            onLoadMoreReplies={loadMoreReplies}
          />
        )}
      </div>
    </div>
  );
});
