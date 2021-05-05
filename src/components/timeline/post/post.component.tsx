import React, { useState, useRef } from 'react';
//@ts-ignore
import { FacebookProvider, EmbeddedPost } from 'react-facebook';
import ReactMarkdown from 'react-markdown';

import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';

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
import FavoriteIcon from '@material-ui/icons/Favorite';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';

import CommentComponent from '../comment/comment.component';
import ReplyCommentComponent from '../comment/reply.component';
import TwitterReactionComponent from '../reactions/twitter.component';
import PostAvatarComponent from './post-avatar.component';
import PostImageComponent from './post-image.component';
import PostVideoComponent from './post-video.component';
import { useStyles } from './post.style';

import clsx from 'clsx';
import SendTipModal from 'src/components/common/SendTipModal';
import ShowIf from 'src/components/common/show-if.component';
import { useSocialDetail } from 'src/hooks/use-social.hook';
import { ImageData } from 'src/interfaces/post';
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

  const [expanded, setExpanded] = useState(open);
  const { detail } = useSocialDetail(post);

  const childRef = useRef<any>();
  const [session] = useSession();
  const router = useRouter();

  const userId = session?.user.address as string;
  const isAnonymous = session?.user.anonymous as boolean;

  const currentPage = router.pathname as string;

  if (!detail) return null;

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const tipPostUser = () => {
    //disable tipping on root page
    if (currentPage === '/') {
      return;
    }
    childRef.current.triggerSendTipModal();
  };

  const replyPost = (comment: string) => {
    reply({
      text: comment,
      postId: post.id as string,
      userId,
      createdAt: new Date()
    });
  };

  const openContentSource = () => {
    window.open(post.link, '_blank');
  };

  const urlToImageData = (url: string): ImageData => {
    return {
      src: url,
      height: 400,
      width: 400
    };
  };

  const PostActionTipUser = (
    <Button
      className={style.action}
      onClick={tipPostUser}
      aria-label="tip-post-user"
      color="primary"
      variant="contained"
      size="small"
      disabled={isAnonymous}>
      Send Tip
    </Button>
  );

  if (!detail) return null;

  const renderPostAvatar = () => {
    return <PostAvatarComponent origin={post.platform} avatar={detail.user.avatar} onClick={openContentSource} />;
  };

  return (
    <>
      <Card className={style.root}>
        <CardHeader avatar={renderPostAvatar()} action={PostActionTipUser} title={detail.user.name} subheader={detail.createdOn} />

        <ShowIf condition={['twitter', 'reddit'].includes(post.platform)}>
          <CardContent className={style.content}>
            <ShowIf condition={post.tags.length > 0}>
              <div>
                {post.tags.map(tag => (
                  <span key={tag}>#{tag}</span>
                ))}
              </div>
            </ShowIf>
            <ReactMarkdown>{detail.text}</ReactMarkdown>
            {detail.images && detail.images.length > 0 && <PostImageComponent images={detail.images} />}
            {detail.videos && detail.videos.length > 0 && <PostVideoComponent url={detail.videos[0]} />}
          </CardContent>
        </ShowIf>

        <ShowIf condition={post.platform === 'myriad'}>
          <CardContent className={style.content}>
            <Typography variant="body1" color="textSecondary" component="p">
              {detail.text}
            </Typography>
            {post.assets && post.assets.length > 0 && <PostImageComponent images={post.assets.map(urlToImageData)} />}
          </CardContent>
        </ShowIf>

        <ShowIf condition={post.platform === 'facebook'}>
          <CardContent className={style.content}>
            <FacebookProvider appId="1349208398779551">
              <EmbeddedPost href={post.link} width="700" />
            </FacebookProvider>
          </CardContent>
        </ShowIf>

        <CardActions disableSpacing>
          <ShowIf condition={post.platform === 'twitter'}>
            <TwitterReactionComponent metric={detail.metric} />
          </ShowIf>
          <IconButton aria-label="add to favorites">
            <FavoriteIcon />
          </IconButton>
          <IconButton aria-label="share">
            <ThumbDownIcon />
          </IconButton>

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

      <SendTipModal userAddress={userId} ref={childRef} walletAddress={post.walletAddress} />
    </>
  );
}
