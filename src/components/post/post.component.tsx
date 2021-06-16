import React, { useState, useRef } from 'react';
//@ts-ignore
import { FacebookProvider, EmbeddedPost } from 'react-facebook';
import ReactMarkdown from 'react-markdown';

import { useSession } from 'next-auth/client';
import dynamic from 'next/dynamic';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

import { PostActionComponent } from './post-action.component';
import PostAvatarComponent from './post-avatar.component';
import PostImageComponent from './post-image.component';
import { PostOptionsComponent } from './post-options.component';
import PostVideoComponent from './post-video.component';
import { useStyles } from './post.style';

import remarkGFM from 'remark-gfm';
import remarkHTML from 'remark-html';
import SendTipModal from 'src/components/common/SendTipModal';
import ShowIf from 'src/components/common/show-if.component';
//import { useBalance } from '../wallet/use-balance.hooks';
import { useSocialDetail } from 'src/hooks/use-social.hook';
import { BalanceDetail } from 'src/interfaces/balance';
import { ImageData } from 'src/interfaces/post';
import { Post } from 'src/interfaces/post';
import { v4 as uuid } from 'uuid';

const CommentComponent = dynamic(() => import('./comment/comment.component'));

type Props = {
  defaultExpanded?: boolean;
  disable?: boolean;
  post: Post;
  postOwner?: boolean;
  balanceDetails: BalanceDetail[];
};

export default function PostComponent({ balanceDetails, post, defaultExpanded = false, disable = false, postOwner }: Props) {
  const style = useStyles();

  const { detail } = useSocialDetail(post);
  const [expanded, setExpanded] = useState(defaultExpanded);
  const childRef = useRef<any>();
  const headerRef = useRef<any>();

  const [session] = useSession();

  const userId = session?.user.address as string;

  if (!detail) return null;

  if (post.text === '[removed]' && post.platform === 'reddit') return null;

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const tipPostUser = () => {
    if (disable) {
      return;
    }
    childRef.current.triggerSendTipModal();
  };

  const openContentSource = () => {
    if (post.platform === 'twitter') {
      window.open(`https://twitter.com/${post.platformUser?.username}`, '_blank');
    } else if (post.platform === 'reddit') {
      window.open(`https://reddit.com/user/${post.platformUser?.username}`, '_blank');
    } else {
      window.open(post.link, '_blank');
    }
  };

  const urlToImageData = (url: string): ImageData => {
    return {
      src: url,
      height: 400,
      width: 400
    };
  };
  const likePost = () => {};

  const dislikePost = () => {};

  if (!detail || !post) return null;

  const renderPostAvatar = () => {
    return <PostAvatarComponent origin={post.platform} avatar={detail.user.avatar} onClick={openContentSource} />;
  };

  return (
    <>
      <Card className={style.root}>
        <CardHeader
          className={style.header}
          ref={headerRef}
          avatar={renderPostAvatar()}
          action={<PostOptionsComponent postId={post.id} ownPost={postOwner || false} />}
          title={detail.user.name}
          subheader={
            <Typography component="div" className={style.subheader}>
              {detail.createdOn}

              {post.importer && (
                <>
                  <FiberManualRecordIcon className={style.circle} />
                  {`Imported from ${post.platform} by `}
                  <b>{post.importer.name}</b>
                </>
              )}
            </Typography>
          }
          style={{ postition: 'relative' }}
        />

        <ShowIf condition={['twitter', 'reddit'].includes(post.platform)}>
          <CardContent className={style.content}>
            <ShowIf condition={post.tags.length > 0}>
              <div>
                {post.tags.map(tag => (
                  <div style={{ marginRight: 4, display: 'inline-block' }} key={uuid()}>
                    #{tag}
                  </div>
                ))}
              </div>
            </ShowIf>
            <ReactMarkdown remarkPlugins={[remarkGFM, remarkHTML]}>{detail.text}</ReactMarkdown>
            {detail.images && detail.images.length > 0 && <PostImageComponent images={detail.images} />}
            {detail.videos && detail.videos.length > 0 && <PostVideoComponent url={detail.videos[0]} />}
          </CardContent>
        </ShowIf>

        <ShowIf condition={post.platform === 'myriad'}>
          <CardContent className={style.content}>
            <Typography variant="body1" color="textPrimary" component="p">
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

        <CardActions disableSpacing className={style.action}>
          <PostActionComponent
            post={post}
            detail={detail}
            expandComment={handleExpandClick}
            commentExpanded={expanded}
            likePost={likePost}
            dislikePost={dislikePost}
            tipOwner={tipPostUser}
          />
        </CardActions>

        <ShowIf condition={expanded}>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent className={style.reply}>
              <CommentComponent post={post} disableReply={disable} hide={handleExpandClick} balanceDetails={balanceDetails} />
            </CardContent>
          </Collapse>
        </ShowIf>
      </Card>

      <SendTipModal userAddress={userId} ref={childRef} postId={post.id as string} balanceDetails={balanceDetails} />
    </>
  );
}
