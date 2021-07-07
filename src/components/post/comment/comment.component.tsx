import React, { useEffect, useRef, useState } from 'react';

import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';

import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import { withStyles, createStyles, Theme } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';

import { useStyles } from './comment.style';
import ReplyCommentComponent from './reply.component';

import CardTitle from 'src/components/common/CardTitle.component';
import DateFormat from 'src/components/common/DateFormat';
import SendTipModal from 'src/components/common/sendtips/SendTipModal';
import ShowIf from 'src/components/common/show-if.component';
import { TabPanel } from 'src/components/common/tab-panel.component';
import { useUser } from 'src/context/user.context';
import { useCommentHook } from 'src/hooks/use-comment.hook';
import { BalanceDetail } from 'src/interfaces/balance';
import { Post, Comment } from 'src/interfaces/post';
import { Token } from 'src/interfaces/token';
import { User } from 'src/interfaces/user';

const StyledBadge = withStyles((theme: Theme) =>
  createStyles({
    badge: {
      right: 40,
      top: 30,
      border: `1px solid ${theme.palette.background.paper}`,
      padding: '0 4px'
    }
  })
)(Badge);

type Props = {
  post: Post;
  disableReply: boolean;
  hide: () => void;
  balanceDetails: BalanceDetail[];
  availableTokens: Token[];
};

export default function CommentComponent({ balanceDetails, post, disableReply, hide, availableTokens }: Props) {
  const style = useStyles();
  const theme = useTheme();

  const {
    state: { user }
  } = useUser();

  const { comments, loadInitComment, reply } = useCommentHook(post);
  const router = useRouter();
  const [session] = useSession();
  const userId = session?.user.id as string;
  const isAnonymous = Boolean(session?.user.anonymous);
  const childRef = useRef<any>();
  const [selectedTab, setSelectedTab] = React.useState(0);

  useEffect(() => {
    if (post.publicMetric && post.publicMetric.comment > 0) {
      loadInitComment();
    }
  }, [post]);

  const tipPostUser = () => {
    childRef.current.triggerSendTipModal();
  };

  const replyPost = (comment: string) => {
    if (!user) return;

    reply(user, {
      text: comment,
      postId: post.id,
      userId,
      createdAt: new Date()
    });
  };

  const handleTabChange = (event: React.ChangeEvent<{}>, tabIndex: number) => {
    setSelectedTab(tabIndex);
  };

  const openCommentProfile = (user?: User) => {
    if (user) {
      router.push(user.id);
    }
  };

  const renderAction = (comment: Comment) => {
    if (userId != comment.userId)
      return (
        <Button className={style.action} onClick={tipPostUser} aria-label="tip-post-user" color="primary" variant="contained" size="small">
          Send Tip
        </Button>
      );
    return null;
  };

  const [_, setTippedPost] = useState<Post>();
  const handleTipSentSuccess = (postId: string) => {
    if (post.id === postId) {
      setTippedPost(post);
      //setOpenTipSummary(true);
    }
  };

  return (
    <div>
      <Tabs value={selectedTab} onChange={handleTabChange} indicatorColor="primary" textColor="primary" variant="fullWidth">
        <Tab label={<Typography style={{ color: '#000000' }}>General Comments ({comments.length})</Typography>} />
        <Tab disabled label={<Typography>Debate Section (0) </Typography>} />
      </Tabs>
      <TabPanel value={selectedTab} index={0} dir={theme.direction}>
        <Grid container spacing={2} direction="column" className={style.comment}>
          {comments.map((comment, i) => {
            return (
              <Grid item key={i}>
                <Card className={style.root}>
                  <CardHeader
                    avatar={
                      <IconButton aria-label="cart" onClick={() => openCommentProfile(comment.user)}>
                        <StyledBadge color="secondary">
                          <Avatar aria-label={comment.user?.name} src={comment.user?.profilePictureURL}>
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
                  <SendTipModal
                    availableTokens={availableTokens}
                    success={postId => handleTipSentSuccess(postId)}
                    postId={post?.id as string}
                    userAddress={userId}
                    ref={childRef}
                    receiverId={comment?.user?.id as string}
                    balanceDetails={balanceDetails}
                  />
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </TabPanel>
      <TabPanel value={selectedTab} index={1} dir={theme.direction}>
        Debate Content
      </TabPanel>

      <ShowIf condition={!disableReply}>
        <ReplyCommentComponent isAnonymous={isAnonymous} close={hide} onSubmit={replyPost} />
      </ShowIf>
    </div>
  );
}
