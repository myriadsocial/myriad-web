import React from 'react';
import { makeStyles, Theme, createStyles, lighten } from '@material-ui/core/styles';
import clsx from 'clsx';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CommentIcon from '@material-ui/icons/Comment';
import CommentComponent from './comment.component';
import LoginOverlayComponent from '../login/overlay.component';
import ShowIf from '../common/show-if.component';
import ReplyCommentComponent from './reply.component';
import PostImage from './image-post.component';
import PostVideo from './video-post.component';
import { Post } from '../../interfaces/post';
import FacebookReactionComponent from './reactions/facebook.component';
import TwitterReactionComponent from './reactions/twitter.component';
import PostAvatar from './post-avatar.component';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      fontSize: 14
    },
    media: {
      height: 0,
      paddingTop: '56.25%' // 16:9
    },
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest
      })
    },
    expandOpen: {
      transform: 'rotate(180deg)'
    },
    content: {
      '& > *': {
        marginBottom: theme.spacing(1)
      }
    },
    reply: {
      backgroundColor: lighten(theme.palette.primary.main, 0.15)
    },
    comment: {
      marginBottom: theme.spacing(1)
    },
    avatar: {
      backgroundColor: '#E849BD'
    },
    action: {
      marginTop: 16
    }
  })
);

type Props = {
  open?: boolean;
  disable?: boolean;
  post: Post;
};

export default function PostComponent({ post, open = false, disable = false }: Props) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(open);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const PostAction = (
    <Button className={classes.action} aria-label="settings" color="primary" variant="contained" size="small">
      Send Tip
    </Button>
  );

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={<PostAvatar origin={post.origin} avatar={post.user.avatar} />}
        action={PostAction}
        title="John Doe"
        subheader="February 14, 2021"
      />

      <CardContent className={classes.content}>
        <Typography variant="body1" color="textSecondary" component="p">
          {post.text}
        </Typography>

        {post.images && post.images.length > 0 && <PostImage images={post.images} />}
        {post.videos && post.videos.length > 0 && <PostVideo url={post.videos[0]} />}
      </CardContent>

      <CardActions disableSpacing>
        <ShowIf condition={post.origin === 'facebook'}>
          <FacebookReactionComponent />
        </ShowIf>

        <ShowIf condition={post.origin === 'twitter'}>
          <TwitterReactionComponent />
        </ShowIf>

        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more">
          <CommentIcon />
        </IconButton>

        <Typography component="span">2 Comments</Typography>
      </CardActions>

      <ShowIf condition={!!post.replies}>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent className={classes.reply}>
            <Grid container spacing={2} direction="column" className={classes.comment}>
              <Grid item>
                <CommentComponent />
              </Grid>
            </Grid>

            <ShowIf condition={!disable}>
              <ReplyCommentComponent close={handleExpandClick} />
            </ShowIf>

            <ShowIf condition={false}>
              <LoginOverlayComponent toggleLogin={handleExpandClick} />
            </ShowIf>
          </CardContent>
        </Collapse>
      </ShowIf>
    </Card>
  );
}
