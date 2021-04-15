import React, { useState, useRef } from 'react';

import { useSession } from 'next-auth/client';

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

import CommentComponent from '../comment/comment.component';
import ReplyCommentComponent from '../comment/reply.component';
import FacebookReactionComponent from '../reactions/facebook.component';
import TwitterReactionComponent from '../reactions/twitter.component';
import PostImage from './image-post.component';
import PostAvatar from './post-avatar.component';
import { useStyles } from './post.style';
import PostVideo from './video-post.component';

import clsx from 'clsx';
import SendTipModal from 'src/components/common/SendTipModal';
import ShowIf from 'src/components/common/show-if.component';
import { useSocialDetail } from 'src/hooks/use-social.hook';
import { Post, Comment } from 'src/interfaces/post';

type Props = {
  open?: boolean;
  disable?: boolean;
  post: Post;
  reply: (comment: Comment) => void;
  loadComments: (postId: string) => void;
};

export default function PostComponent({ post, open = false, disable = false, reply, loadComments }: Props) {
  const style = useStyles();
  
  const childRef = useRef<any>();
  const [session] = useSession();
  const [expanded, setExpanded] = useState(open);
  const { detail } = useSocialDetail(post);

  const userId = session?.user.address as string;

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const tipPostUser = () => {
    childRef.current.triggerSendTipModal();
  };

  const replyPost = (comment: string) => {
    reply({
      text: comment,
      postId: post.id,
      userId,
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
    <>
    <Card className={style.root}>
      <CardHeader
        avatar={<PostAvatar origin={post.platform} avatar={detail.user.avatar} onClick={openContentSource} />}
        action={PostActionTipUser}
        title={detail.user.name}
        subheader={detail.createdOn}
      />

      <CardContent className={style.content}>
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
      </CardActions>
      </Card>

      <SendTipModal ref={childRef} />
    </>
  );
}
