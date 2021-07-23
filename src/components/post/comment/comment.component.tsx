import React, {useEffect, useRef, useState, forwardRef} from 'react';
import {useSelector} from 'react-redux';

import {useRouter} from 'next/router';

import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import {withStyles, createStyles, Theme} from '@material-ui/core/styles';

import {useStyles} from './comment.style';
import ReplyCommentComponent from './reply.component';

import CardTitle from 'src/components/common/CardTitle.component';
import DateFormat from 'src/components/common/DateFormat';
import SendTipModal from 'src/components/common/sendtips/SendTipModal';
import ShowIf from 'src/components/common/show-if.component';
import {useCommentHook} from 'src/hooks/use-comment.hook';
import {BalanceDetail} from 'src/interfaces/balance';
import {Post, Comment} from 'src/interfaces/post';
import {Props} from 'src/interfaces/send-tips/send-tips';
import {Token} from 'src/interfaces/token';
import {User} from 'src/interfaces/user';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

const StyledBadge = withStyles((theme: Theme) =>
  createStyles({
    badge: {
      right: 40,
      top: 30,
      border: `1px solid ${theme.palette.background.paper}`,
      padding: '0 4px',
    },
  }),
)(Badge);

const ForwardedSendTipModal = forwardRef(
  (
    {
      userAddress,
      success,
      postId,
      balanceDetails,
      receiverId,
      availableTokens,
      walletReceiverDetail,
    }: Props,
    ref,
  ) => (
    <SendTipModal
      userAddress={userAddress}
      success={success}
      postId={postId}
      balanceDetails={balanceDetails}
      receiverId={receiverId}
      availableTokens={availableTokens}
      walletReceiverDetail={walletReceiverDetail}
      forwardedRef={ref}
    />
  ),
);

type CommentComponentProps = {
  post: Post;
  disableReply: boolean;
  hide: () => void;
  balanceDetails: BalanceDetail[];
  availableTokens: Token[];
};

const CommentComponent: React.FC<CommentComponentProps> = ({
  balanceDetails,
  post,
  disableReply,
  hide,
  availableTokens,
}) => {
  const style = useStyles();

  const router = useRouter();
  const {user, anonymous} = useSelector<RootState, UserState>(state => state.userState);
  const {comments, loadInitComment, reply} = useCommentHook(post);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sendTipRef = useRef<any>();

  useEffect(() => {
    loadInitComment();
  }, []);

  const tipPostUser = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    sendTipRef.current?.triggerSendTipModal();
  };

  const replyPost = (comment: string) => {
    if (!user) return;

    reply(user, {
      text: comment,
      postId: post.id,
      userId: user.id,
      createdAt: new Date(),
    });
  };

  const openCommentProfile = (user?: User) => {
    if (user) {
      router.push(user.id);
    }
  };

  const renderAction = (comment: Comment) => {
    if (user && user.id != comment.userId)
      return (
        <Button
          className={style.action}
          onClick={tipPostUser}
          aria-label="tip-post-user"
          color="primary"
          variant="contained"
          size="small"
          disabled={anonymous}>
          Send Tip
        </Button>
      );
    return null;
  };

  const [, setTippedPost] = useState<Post>();
  const handleTipSentSuccess = (postId: string) => {
    if (post.id === postId) {
      setTippedPost(post);
      //setOpenTipSummary(true);
    }
  };

  return (
    <div>
      <Grid container spacing={2} direction="column" className={style.comment}>
        {comments.map(comment => {
          return (
            <Grid item key={comment.id}>
              <Card className={style.root}>
                <CardHeader
                  avatar={
                    <IconButton aria-label="cart" onClick={() => openCommentProfile(comment.user)}>
                      <StyledBadge color="secondary">
                        <Avatar
                          aria-label={comment.user?.name}
                          src={comment.user?.profilePictureURL}>
                          {comment.user?.name}
                        </Avatar>
                      </StyledBadge>
                    </IconButton>
                  }
                  action={renderAction(comment)}
                  title={<CardTitle text={comment.user?.name || ''} url={comment.user?.id} />}
                  subheader={<DateFormat date={comment.createdAt} />}
                />
                <CardContent>
                  <Typography variant="body1" color="textPrimary" component="p">
                    {comment.text}
                  </Typography>
                </CardContent>
                {user && (
                  <ForwardedSendTipModal
                    availableTokens={availableTokens}
                    success={postId => handleTipSentSuccess(postId)}
                    postId={post?.id as string}
                    userAddress={user.id}
                    ref={sendTipRef}
                    receiverId={comment?.user?.id as string}
                    balanceDetails={balanceDetails}
                  />
                )}
              </Card>
            </Grid>
          );
        })}
      </Grid>
      <ShowIf condition={!disableReply}>
        <ReplyCommentComponent isAnonymous={anonymous} close={hide} onSubmit={replyPost} />
      </ShowIf>
    </div>
  );
};

export default CommentComponent;
