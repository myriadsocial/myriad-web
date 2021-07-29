import React, {useState, useRef, useEffect} from 'react';
import {FacebookProvider, EmbeddedPost} from 'react-facebook';
import ReactMarkdown from 'react-markdown';
import {useSelector} from 'react-redux';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import {useRouter} from 'next/router';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';

import {PostActionComponent} from './post-action.component';
import PostAvatarComponent from './post-avatar.component';
import PostImageComponent from './post-image.component';
import {PostSubHeader} from './post-sub-header.component';
import PostVideoComponent from './post-video.component';
import {useStyles} from './post.style';

import remarkGFM from 'remark-gfm';
import remarkHTML from 'remark-html';
import CardTitle from 'src/components/common/CardTitle.component';
import SendTipModal from 'src/components/common/sendtips/SendTipModal';
import {useWalletAddress} from 'src/components/common/sendtips/use-wallet.hook';
import ShowIf from 'src/components/common/show-if.component';
import {useTipSummaryHook} from 'src/components/tip-summary/tip-summar.hook';
import {useModal} from 'src/hooks/use-modal.hook';
import {usePostHook} from 'src/hooks/use-post.hook';
import {useSocialDetail} from 'src/hooks/use-social.hook';
import {ImageData} from 'src/interfaces/post';
import {Post, Comment} from 'src/interfaces/post';
import {ContentType} from 'src/interfaces/wallet';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';
import {v4 as uuid} from 'uuid';

const CommentComponent = dynamic(() => import('./comment/comment.component'), {
  ssr: false,
});
const Linkify = dynamic(() => import('src/components/common/Linkify.component'), {
  ssr: false,
});

const FACEBOOK_APP_ID = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID as string;

type PostComponentProps = {
  defaultExpanded?: boolean;
  disable?: boolean;
  post: Post;
  postOwner?: boolean;
};

const PostComponent: React.FC<PostComponentProps> = ({
  post,
  defaultExpanded = false,
  disable = false,
}) => {
  const style = useStyles();
  const router = useRouter();
  const {
    user,
    anonymous,
    tokens: availableTokens,
  } = useSelector<RootState, UserState>(state => state.userState);
  const {loading, detail} = useSocialDetail(post);
  const {isShown, toggle, hide} = useModal();

  const {likePost, dislikePost} = usePostHook();
  const {openTipSummary} = useTipSummaryHook();
  const [expanded, setExpanded] = useState(defaultExpanded);
  // pindah ke redux
  const [recipientDetail, setRecipientDetail] = useState({
    postId: '',
    walletAddress: '',
    contentType: ContentType.POST,
  });
  const {loadWalletDetails, walletDetails} = useWalletAddress(post.id);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const headerRef = useRef<any>();

  const defineWalletReceiverDetail = () => {
    const tempWalletDetail = walletDetails.filter(walletDetail => {
      return walletDetail.postId === post.id;
    });
    const matchingWalletDetail = tempWalletDetail[0];
    setRecipientDetail(matchingWalletDetail);
  };

  useEffect(() => {
    loadWalletDetails();
  }, [post.id]);

  if (!detail && !user && !anonymous) return null;

  if (!walletDetails) return null;

  if (post.text === '[removed]' && post.platform === 'reddit') return null;

  const handleExpandClick = (): void => {
    setExpanded(!expanded);
  };

  const tipPostUser = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disable) {
      return;
    }

    e.stopPropagation();
    defineWalletReceiverDetail();

    toggle();
  };

  const defineRecipientDetail = (comment: Comment) => {
    const recipientDetail = {
      postId: comment.id,
      walletAddress: comment.userId,
      contentType: ContentType.COMMENT,
    };

    return recipientDetail;
  };

  const tipCommentUser = (comment: Comment) => {
    const {postId, walletAddress} = defineRecipientDetail(comment);
    setRecipientDetail({
      postId,
      walletAddress,
      contentType: ContentType.POST,
    });

    toggle();
  };

  const openContentSource = (): void => {
    if (!post.platformUser) {
      return;
    }

    const url = getPlatformUrl();

    switch (post.platform) {
      case 'myriad':
        router.push(post.platformUser.platform_account_id);
        break;
      default:
        window.open(url, '_blank');
        break;
    }
  };

  const getPlatformUrl = (): string => {
    let url = '';

    if (!post.platformUser) return url;

    switch (post.platform) {
      case 'twitter':
        url = `https://twitter.com/${post.platformUser.username}`;
        break;
      case 'reddit':
        url = `https://reddit.com/user/${post.platformUser.username}`;
        break;
      case 'myriad':
        url = post.platformUser.platform_account_id;
        break;
      default:
        url = post.link || '';
        break;
    }

    return url;
  };

  const urlToImageData = (url: string): ImageData => {
    return {
      src: url,
      height: 400,
      width: 400,
    };
  };

  if (!detail || !post) return null;

  const handleTipSentSuccess = (postId: string) => {
    if (post.id === postId) {
      openTipSummary(post);
    }
  };

  const renderPostAvatar = () => {
    let avatarUrl: string = post.platformUser.profile_image_url;

    if (post.platform === 'myriad' && post.platformUser?.platform_account_id === user?.id) {
      avatarUrl = user?.profilePictureURL as string;
    }

    return (
      <PostAvatarComponent origin={post.platform} avatar={avatarUrl} onClick={openContentSource} />
    );
  };

  const likePostHandle = () => {
    likePost(post.id);
  };

  const dislikePostHandle = () => {
    dislikePost(post.id);
  };

  const onHashtagClicked = async (hashtag: string) => {
    await router.push(`/home?tag=${hashtag.replace('#', '')}&type=trending`, undefined, {
      shallow: true,
    });
  };

  if (loading) return null;

  return (
    <>
      <Card className={style.root}>
        <CardHeader
          className={style.header}
          disableTypography
          ref={headerRef}
          avatar={renderPostAvatar()}
          title={<CardTitle text={detail.user.name} url={getPlatformUrl()} />}
          subheader={
            <PostSubHeader
              date={detail.createdOn}
              importer={post.importer}
              platform={post.platform}
            />
          }
        />
        <CardContent className={style.content}>
          <ShowIf condition={['twitter'].includes(post.platform)}>
            <Linkify
              text={detail.text}
              handleClick={onHashtagClicked}
              variant="body1"
              color="textPrimary"
            />

            {detail.images && detail.images.length > 0 && (
              <PostImageComponent images={detail.images} />
            )}

            {detail.videos && detail.videos.length > 0 && (
              <PostVideoComponent url={detail.videos[0]} />
            )}
          </ShowIf>

          <ShowIf condition={['reddit'].includes(post.platform)}>
            <ReactMarkdown skipHtml remarkPlugins={[remarkGFM, remarkHTML]}>
              {detail.text}
            </ReactMarkdown>

            {post.asset?.images && post.asset.images.length > 0 && (
              <PostImageComponent images={post.asset.images.map(urlToImageData)} />
            )}
            {post.asset?.videos && post.asset.videos.length > 0 && (
              <PostVideoComponent url={post.asset.videos[0]} />
            )}
          </ShowIf>

          <ShowIf condition={post.platform === 'myriad'}>
            <div>
              {post.tags.map(tag => (
                <div style={{marginRight: 4, display: 'inline-block'}} key={uuid()}>
                  <Link href={`?tag=${tag}&type=trending`} shallow={true}>
                    <a href={`?tag=${tag}&type=trending`}>#{tag}</a>
                  </Link>
                </div>
              ))}
            </div>

            <Typography variant="body1" color="textPrimary" component="p">
              {detail.text}
            </Typography>
            {post.asset?.images && post.asset?.images.length > 0 && (
              <PostImageComponent images={post.asset.images.map(urlToImageData)} />
            )}
          </ShowIf>

          <ShowIf condition={post.platform === 'facebook'}>
            <FacebookProvider appId={FACEBOOK_APP_ID}>
              <EmbeddedPost href={post.link} width="700" />
            </FacebookProvider>
          </ShowIf>
        </CardContent>

        <CardActions disableSpacing className={style.action}>
          <PostActionComponent
            post={post}
            detail={detail}
            expandComment={handleExpandClick}
            commentExpanded={expanded}
            likePost={likePostHandle}
            dislikePost={dislikePostHandle}
            tipOwner={tipPostUser}
          />
        </CardActions>

        <ShowIf condition={expanded}>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent className={style.reply}>
              <CommentComponent
                post={post}
                disableReply={disable}
                hide={handleExpandClick}
                toggleSendTip={comment => tipCommentUser(comment)}
              />
            </CardContent>
          </Collapse>
        </ShowIf>
      </Card>
      {user && (
        <SendTipModal
          isShown={isShown}
          hide={hide}
          availableTokens={availableTokens}
          success={postId => handleTipSentSuccess(postId)}
          userAddress={user.id}
          postId={post.id as string}
          walletReceiverDetail={recipientDetail}
        />
      )}{' '}
    </>
  );
};

export default PostComponent;
