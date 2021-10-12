import {TNode} from '@udecode/plate';

import React, {useState} from 'react';
import {FacebookProvider, EmbeddedPost} from 'react-facebook';
import ReactMarkdown from 'react-markdown';
import {useSelector, useDispatch} from 'react-redux';

import {useRouter} from 'next/router';

import {Typography} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';

import LinkifyComponent from '../../components/common/Linkify.component';
import ShowIf from '../../components/common/show-if.component';
import {Post} from '../../interfaces/post';
import {User} from '../../interfaces/user';
import {RootState} from '../../reducers';
import {BalanceState} from '../../reducers/balance/reducer';
import {setTippedContent} from '../../reducers/timeline/actions';
import {PostRender} from '../PostEditor/PostRender';
import {formatStringToNode} from '../PostEditor/formatter';
import {Button, ButtonVariant, ButtonColor, ButtonSize} from '../atoms/Button';
import {Gallery} from '../atoms/Gallery';
import {NSFW} from '../atoms/NSFW/NSFW.component';
import {PostActionComponent} from '../atoms/PostAction';
import {HeaderComponent} from '../atoms/PostHeader';
import {ReadMore} from '../atoms/ReadMore/ReadMore';
import {TabsComponent} from '../atoms/Tabs';
import {Video} from '../atoms/Video';
import {useStyles} from './PostDetail.styles';
import {useCommentTabs, CommentTabs} from './hooks/use-comment-tabs';

import remarkGFM from 'remark-gfm';
import remarkHTML from 'remark-html';
import {LinkPreview} from 'src/components-v2/atoms/LinkPreview';
import {Comment} from 'src/interfaces/comment';

type PostDetailProps = {
  user?: User;
  post: Post;
  anonymous: boolean;
  toggleDownvoting: (reference: Post | Comment | null) => void;
  onUpvote: (reference: Post | Comment) => void;
  onSendTip: (post: Post) => void;
  onOpenTipHistory: (post: Post) => void;
  onDelete: (post: Post) => void;
  onReport: (post: Post) => void;
  onShared: (post: Post, type: 'link' | 'post') => void;
};

export const PostDetail: React.FC<PostDetailProps> = props => {
  const {balanceDetails} = useSelector<RootState, BalanceState>(state => state.balanceState);

  const styles = useStyles();
  const router = useRouter();

  const dispatch = useDispatch();

  const {
    user,
    post,
    onUpvote,
    onSendTip,
    toggleDownvoting,
    onOpenTipHistory,
    onDelete,
    onReport,
    onShared,
  } = props;
  const tabs = useCommentTabs(post);

  const [activeTab, setActiveTab] = useState<CommentTabs>('discussion');
  const [shoWcomment, setShowComment] = useState(false);
  const [viewContent, setViewContent] = useState(!post.isNSFW);
  const owner = post.createdBy === user?.id;

  const onHashtagClicked = async (hashtag: string) => {
    await router.push(`/home?tag=${hashtag.replace('#', '')}&type=trending`, undefined, {
      shallow: true,
    });
  };

  const handleUpvote = async () => {
    if (!post.isUpvoted) {
      onUpvote(post);
    }
  };

  const handleDownVote = async () => {
    if (!post.isDownVoted) {
      toggleDownvoting(post);
    }

    setShowComment(true);
    setActiveTab('debate');
  };

  const handleChangeTab = (tab: string) => {
    setActiveTab(tab as CommentTabs);

    toggleDownvoting(null);
  };

  const handleViewContent = () => {
    setViewContent(true);
  };

  const toggleShowComments = () => {
    setShowComment(prev => !prev);

    toggleDownvoting(null);
  };

  const handleSendTip = () => {
    onSendTip(post);
    const contentType = 'post';
    const referenceId = post.id;
    dispatch(setTippedContent(contentType, referenceId));
  };

  const handleDeletePost = () => {
    onDelete(post);
  };

  const handleReportPost = () => {
    onReport(post);
  };

  const handleShareLink = () => {
    onShared(post, 'link');
  };

  const handleSharePost = () => {
    onShared(post, 'post');
  };

  const handleOpenTipHistory = () => {
    console.log('handleOpenTipHistory', post);
    onOpenTipHistory(post);
  };

  const getText = (): TNode[] => {
    try {
      const nodes = JSON.parse(post.text) as TNode[];

      if (Array.isArray(nodes)) {
        return nodes;
      } else {
        return [formatStringToNode(post.text)];
      }
    } catch (e) {
      return [formatStringToNode(post.text)];
    }
  };

  console.log({owner});

  return (
    <Paper square className={styles.root}>
      <HeaderComponent
        owner={owner}
        post={post}
        onOpenTipHistory={handleOpenTipHistory}
        onDelete={handleDeletePost}
        onReport={handleReportPost}
        onShared={handleSharePost}
      />

      <div className={styles.content}>
        <ShowIf condition={!viewContent}>
          <NSFW viewContent={handleViewContent} />
        </ShowIf>

        <ShowIf condition={viewContent}>
          <ShowIf condition={post.platform === 'myriad'}>
            <Typography variant="body1" color="textPrimary" component="p">
              <PostRender nodes={getText()} />
              <ReadMore text={''} maxCharacter={250} />
            </Typography>
          </ShowIf>

          <ShowIf condition={['twitter'].includes(post.platform)}>
            <LinkifyComponent
              text={post.text}
              handleClick={onHashtagClicked}
              variant="body1"
              color="textPrimary"
            />
          </ShowIf>

          <ShowIf condition={['reddit'].includes(post.platform)}>
            {post.title && (
              <LinkifyComponent
                text={post.title}
                handleClick={onHashtagClicked}
                variant="h4"
                color="textPrimary"
              />
            )}

            <ReactMarkdown skipHtml remarkPlugins={[remarkGFM, remarkHTML]}>
              {post.text}
            </ReactMarkdown>
          </ShowIf>

          <ShowIf condition={post.platform === 'facebook'}>
            <FacebookProvider appId={'1349208398779551'}>
              <EmbeddedPost href={post.url} width="700" />
            </FacebookProvider>
          </ShowIf>

          {post.asset?.images && post.asset?.images.length > 0 && (
            <Gallery images={post.asset?.images} onImageClick={console.log} cloudName="dsget80gs" />
          )}

          {post.asset?.videos && post.asset.videos.length > 0 && (
            <Video url={post.asset.videos[0]} />
          )}
        </ShowIf>

        {post.embeddedURL && <LinkPreview embed={post.embeddedURL} />}
      </div>

      <div className={styles.action}>
        <PostActionComponent
          metrics={post.metric}
          upvoted={post.isUpvoted}
          downvoted={post.isDownVoted}
          onUpvote={handleUpvote}
          onDownVote={handleDownVote}
          onShowComments={toggleShowComments}
          shareUrl={`${window.location.origin}/post/${post.id}`}
          onShared={handleShareLink}
        />

        {
          // hide button if it's owner's post or balance is not yet loaded
        }
        <ShowIf condition={owner || balanceDetails.length === 0}>
          <></>
        </ShowIf>

        <ShowIf condition={!owner}>
          <Button
            onClick={handleSendTip}
            variant={ButtonVariant.OUTLINED}
            color={ButtonColor.SECONDARY}
            size={ButtonSize.SMALL}
            className={styles.sendTips}
          >
            Send Tip
          </Button>
        </ShowIf>
      </div>

      <ShowIf condition={shoWcomment}>
        <TabsComponent tabs={tabs} active={activeTab} onChangeTab={handleChangeTab} />
      </ShowIf>
    </Paper>
  );
};
