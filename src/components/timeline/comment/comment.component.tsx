import React, { useEffect, useRef } from 'react';

import { useSession } from 'next-auth/client';

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

import { useBalance } from '../../wallet/use-balance.hooks';
import { useComments } from './comment.context';
import { useStyles } from './comment.style';
import ReplyCommentComponent from './reply.component';
import { useCommentHook } from './use-comment.hook';

import DateFormat from 'src/components/common/DateFormat';
import SendTipModal from 'src/components/common/SendTipModal';
import ShowIf from 'src/components/common/show-if.component';
import { TabPanel } from 'src/components/common/tab-panel.component';
import { useUser } from 'src/components/user/user.context';
import { Post, Comment } from 'src/interfaces/post';

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
};

export default function CommentComponent({ post, disableReply, hide }: Props) {
  const style = useStyles();
  const theme = useTheme();

  const { state } = useComments();
  const { state: userState } = useUser();

  const { loadInitComment, reply } = useCommentHook(post);

  const [session] = useSession();
  const userId = session?.user.id as string;
  const { freeBalance } = useBalance(userId);
  const childRef = useRef<any>();
  const [selectedTab, setSelectedTab] = React.useState(0);

  useEffect(() => {
    if (post.publicMetric?.comment > 0) {
      loadInitComment();
    }
  }, [post]);

  const tipPostUser = () => {
    childRef.current.triggerSendTipModal();
  };

  const replyPost = (comment: string) => {
    if (!userState.user) return;

    reply(userState.user, {
      text: comment,
      postId: post.id,
      userId,
      createdAt: new Date()
    });
  };

  const handleTabChange = (event: React.ChangeEvent<{}>, tabIndex: number) => {
    setSelectedTab(tabIndex);
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

  return (
    <div>
      <Tabs value={selectedTab} onChange={handleTabChange} indicatorColor="primary" textColor="primary" variant="fullWidth">
        <Tab label={<Typography style={{ color: '#000000' }}>General Comments ({state.comments.length})</Typography>} />
        <Tab disabled label={<Typography>Debate Section (0) </Typography>} />
      </Tabs>
      <TabPanel value={selectedTab} index={0} dir={theme.direction}>
        <Grid container spacing={2} direction="column" className={style.comment}>
          {state.comments.map((comment, i) => {
            return (
              <Grid item key={i}>
                <Card className={style.root}>
                  <CardHeader
                    avatar={
                      <IconButton aria-label="cart">
                        <StyledBadge color="secondary">
                          <Avatar aria-label={comment.user?.name} src={comment.user?.profilePictureURL}>
                            {comment.user?.name}
                          </Avatar>
                        </StyledBadge>
                      </IconButton>
                    }
                    action={renderAction(comment)}
                    title={comment.user?.name}
                    subheader={<DateFormat date={comment.createdAt} />}
                  />
                  <CardContent>
                    <Typography variant="body1" color="textSecondary" component="p">
                      {comment.text}
                    </Typography>
                  </CardContent>
                  <SendTipModal
                    userAddress={userId}
                    ref={childRef}
                    receiverId={comment?.user?.id as string}
                    freeBalance={freeBalance as number}
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
        <ReplyCommentComponent close={hide} onSubmit={replyPost} />
      </ShowIf>
    </div>
  );
}
