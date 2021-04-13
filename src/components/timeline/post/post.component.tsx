import React, { useState } from 'react';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Collapse from '@material-ui/core/Collapse';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CommentIcon from '@material-ui/icons/Comment';

import { sendTip } from '../../../helpers/polkadotApi';
import CommentComponent from '../comment/comment.component';
import ReplyCommentComponent from '../comment/reply.component';
import FacebookReactionComponent from '../reactions/facebook.component';
import TwitterReactionComponent from '../reactions/twitter.component';
import PostImage from './image-post.component';
import PostAvatar from './post-avatar.component';
import { useStyles } from './post.style';
import PostVideo from './video-post.component';

import clsx from 'clsx';
import ShowIf from 'src/components/common/show-if.component';
import { useSocialDetail } from 'src/hooks/use-social.hook';
import { Post, Comment } from 'src/interfaces/post';

type Props = {
  open?: boolean;
  disable?: boolean;
  post: Post;
  reply: (comment: Comment) => void;
  loadComments: (postId: string) => void;
  sendTip?: () => void;
};

export default function PostComponent({ post, open = false, disable = false, reply, loadComments }: Props) {
  const style = useStyles();

  const [expanded, setExpanded] = useState(open);
  const { detail } = useSocialDetail(post);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const tipPostUser = async () => {
    // sendTip will open a pop-up from polkadot.js extension,
    // tx signing is done by supplying a password
    await sendTip();
  };

  const replyPost = (comment: string) => {
    reply({
      text: comment,
      postId: post.id,
      userId: '5EaA8LD2kmicJvJu3v3CJJErxCwWVrQjGi9UnwNCjP4ohriQ',
      createdAt: new Date()
    });
  };

  const openContentSource = () => {
    window.open(post.link, '_blank');
  };

  const PostActionTipUser = (
    <Button className={style.action} onClick={tipPostUser} aria-label="tip-post-user" color="primary" variant="contained" size="small">
      Send Tip
    </Button>
  );

  if (!detail) return null;
  return (
    <Card className={style.root}>
      <CardHeader
        avatar={<PostAvatar origin={post.platform} avatar={detail.user.avatar} />}
        action={PostActionTipUser}
        title={detail.user.name}
        subheader={detail.createdOn}
        //onClick={openContentSource}
        //onClick method moved to CardContent, overlapping with tipPostUser method
      />

      <CardContent className={style.content} onClick={openContentSource}>
        <Typography variant="body1" color="textSecondary" component="p">
          {detail.text}
        </Typography>
        {detail.images && detail.images.length > 0 && <PostImage images={detail.images} />}
        {detail.videos && detail.videos.length > 0 && <PostVideo url={detail.videos[0]} />}
      </CardContent>

      <CardActions disableSpacing>
        <ShowIf condition={post.platform === 'facebook'}>
          <FacebookReactionComponent metric={detail.metric} />
        </ShowIf>

        <ShowIf condition={post.platform === 'twitter'}>
          <TwitterReactionComponent metric={detail.metric} />
        </ShowIf>

        <IconButton
          className={clsx(style.expand, {
            [style.expandOpen]: expanded
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more">
          <CommentIcon />
        </IconButton>

        <Typography component="span">{post.comments.length} Comments</Typography>
      </CardActions>

      <ShowIf condition={expanded}>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent className={style.reply}>
            <Grid container spacing={2} direction="column" className={style.comment}>
              {post.comments.map((comment, i) => (
                <Grid item key={i}>
                  <CommentComponent data={comment} />
                </Grid>
              ))}
            </Grid>

            <ShowIf condition={!disable}>
              <ReplyCommentComponent close={handleExpandClick} onSubmit={replyPost} />
            </ShowIf>
          </CardContent>
        </Collapse>
      </ShowIf>
    </Card>
  );
}
