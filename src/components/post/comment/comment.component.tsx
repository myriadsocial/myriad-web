import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';

import {useRouter} from 'next/router';

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

import {AvatarComponent} from 'src/components/common/Avatar.component';
import CardTitle from 'src/components/common/CardTitle.component';
import DateFormat from 'src/components/common/DateFormat';
import ShowIf from 'src/components/common/show-if.component';
import {acronym} from 'src/helpers/string';
import {useCommentHook} from 'src/hooks/use-comment.hook';
import {Comment} from 'src/interfaces/comment';
import {ReferenceType, SectionType} from 'src/interfaces/interaction';
import {Post} from 'src/interfaces/post';
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

type CommentComponentProps = {
  post: Post;
  disableReply: boolean;
  hide: () => void;
  toggleSendTip: (comment: Comment) => void;
};

const CommentComponent: React.FC<CommentComponentProps> = ({
  post,
  disableReply,
  hide,
  toggleSendTip,
}) => {
  const style = useStyles();

  const router = useRouter();
  const {user, anonymous} = useSelector<RootState, UserState>(state => state.userState);
  const {comments, loadInitComment, reply} = useCommentHook(post.id);

  useEffect(() => {
    loadInitComment();
  }, []);

  const tipPostUser = (e: React.MouseEvent<HTMLButtonElement>, comment: Comment) => {
    e.stopPropagation();
    toggleSendTip(comment);
  };

  const replyPost = (comment: string) => {
    if (!user) return;

    reply(user, {
      text: comment,
      postId: post.id,
      userId: user.id,
      referenceId: post.id,
      section: SectionType.DISCUSSION,
      type: ReferenceType.POST,
      mentions: [],
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
          onClick={e => tipPostUser(e, comment)}
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
                        <AvatarComponent
                          aria-label={comment.user?.name}
                          src={comment.user?.profilePictureURL}>
                          {acronym(comment.user?.name)}
                        </AvatarComponent>
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
