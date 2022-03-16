import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import dynamic from 'next/dynamic';

import {Button, Grid} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import useConfirm from '../common/Confirm/use-confirm.hook';
import {PostDetail} from './PostDetail';
import {usePostDelete} from './hooks/use-post-delete.hook';
import {usePostInteraction} from './hooks/use-post-interaction.hook';

import {PostVisibilityContainer} from 'src/components/PostVisibility';
import {useTimelineHook} from 'src/components/Timeline/hooks/use-timeline.hook';
import {Modal} from 'src/components/atoms/Modal';
import {PromptComponent} from 'src/components/atoms/Prompt/prompt.component';
import {useTipHistory} from 'src/hooks/tip-history.hook';
import {useToasterSnackHook} from 'src/hooks/use-toaster-snack.hook';
import {Comment} from 'src/interfaces/comment';
import {Post} from 'src/interfaces/post';
import {RootState} from 'src/reducers';
import {removeImporter} from 'src/reducers/importers/actions';
import {setTippedContent} from 'src/reducers/timeline/actions';
import {UserState} from 'src/reducers/user/reducer';
import {setTippedUser, setTippedUserId} from 'src/reducers/wallet/actions';
import {setIsTipSent} from 'src/reducers/wallet/actions';
import {WalletState} from 'src/reducers/wallet/reducer';

type PostDetailContainerProps = {
  type?: 'share' | 'default';
  expanded?: boolean;
};

const SendTipContainer = dynamic(() => import('src/components/SendTip/SendTipContainer'), {
  ssr: false,
});
const ReportContainer = dynamic(() => import('../Report/Report.container'), {ssr: false});
const TipHistoryContainer = dynamic(() => import('../TipHistory/TipHistory.container'), {
  ssr: false,
});
const PostImporterContainer = dynamic(() => import('../PostImporterList/PostImporter.container'), {
  ssr: false,
});

export const PostDetailContainer: React.FC<PostDetailContainerProps> = props => {
  const {type = 'default', expanded = true} = props;

  const dispatch = useDispatch();
  const confirm = useConfirm();

  const {post, getTippedUserId} = useTimelineHook();
  const {openTipHistory} = useTipHistory();
  const {openToasterSnack} = useToasterSnackHook();
  const {confirmDeletePost} = usePostDelete();
  const {upVotePost, setDownVotingPost, removePostVote} = usePostInteraction();

  const {user, anonymous} = useSelector<RootState, UserState>(state => state.userState);
  const {isTipSent, explorerURL} = useSelector<RootState, WalletState>(state => state.walletState);

  const [visibility, setVisibility] = useState<Post | null>(null);
  const [openSuccessPrompt, setOpenSuccessPrompt] = useState(false);
  const [tippedPost, setTippedPost] = useState<Post | null>(null);
  const [tippedComment, setTippedComment] = useState<Comment | null>(null);
  const [tippedContentForHistory, setTippedContentForHistory] = useState<Post | Comment | null>(
    null,
  );
  const [reported, setReported] = useState<Post | null>(null);
  const [importedPost, setImportedPost] = useState<Post | null>(null);
  const sendTipOpened = Boolean(tippedPost) || Boolean(tippedComment);

  useEffect(() => {
    if (isTipSent) {
      closeSendTip();
    }
  }, [isTipSent]);

  const handleSendTip = (reference?: Post | Comment) => {
    // type guard to check if reference is a Post object
    if (reference && 'platform' in reference) {
      setTippedPost(reference);
      getTippedUserId(reference.id);
    }

    if (reference && 'section' in reference) {
      setTippedComment(reference);

      dispatch(setTippedUserId(reference.userId));
      dispatch(setTippedUser(reference.user.name, reference.user.profilePictureURL ?? ''));

      const contentType = 'comment';

      let isOtherTippingCurrencyDisabled = false;

      if (!('userSocialMedia' in reference)) isOtherTippingCurrencyDisabled = true;

      dispatch(setTippedContent(contentType, reference.id, isOtherTippingCurrencyDisabled));
    }
  };

  const closeSendTipSuccessPrompt = (): void => {
    setOpenSuccessPrompt(false);
  };

  const handleSharePost = (post: Post, type: 'link' | 'post') => {
    if (type === 'post') {
      openToasterSnack({
        message: 'This post successfully share to your timeline',
        variant: 'success',
      });
    }
  };

  const closeSendTip = () => {
    if (isTipSent && tippedPost) {
      setOpenSuccessPrompt(true);
      setTippedContentForHistory(tippedPost);
    } else if (isTipSent && tippedComment) {
      setOpenSuccessPrompt(true);
      setTippedContentForHistory(tippedComment);
    } else {
      console.log('no post tipped');
    }

    dispatch(setIsTipSent(false));

    setTippedPost(null);
    setTippedComment(null);
  };

  const handleReportPost = (post: Post) => {
    setReported(post);
  };

  const closeReportPost = () => {
    setReported(null);
  };

  const handleImporters = (post: Post) => {
    dispatch(removeImporter());
    setImportedPost(post);
  };

  const closeImportedPost = () => {
    setImportedPost(null);
  };

  const handlePostVisibility = (post: Post) => {
    setVisibility(post);
  };

  const closePostVisibility = () => {
    setVisibility(null);
  };

  const confirmRemovePost = () => {
    confirm({
      title: 'Remove Post',
      description: 'Are you sure to remove this post',
      icon: 'danger',
      confirmationText: 'Yes, proceed to delete',
      cancellationText: 'No, let me rethink',
      onConfirm: () => {
        confirmDeletePost();
      },
    });
  };

  if (!post) return null;

  return (
    <>
      <PostDetail
        user={user}
        key={`post-${post.id}`}
        post={post}
        anonymous={anonymous}
        onUpvote={upVotePost}
        onSendTip={handleSendTip}
        toggleDownvoting={setDownVotingPost}
        onOpenTipHistory={openTipHistory}
        onDelete={confirmRemovePost}
        onReport={handleReportPost}
        onImporters={handleImporters}
        onShared={handleSharePost}
        onRemoveVote={removePostVote}
        onVisibility={handlePostVisibility}
        expanded={expanded}
        type={type}
      />

      <Modal
        gutter="none"
        open={sendTipOpened}
        onClose={closeSendTip}
        title="Send Tip"
        subtitle="Finding this post is insightful? Send a tip!">
        <SendTipContainer />
      </Modal>

      <TipHistoryContainer onSendTip={handleSendTip} />
      <ReportContainer reference={reported} onClose={closeReportPost} />
      <PostImporterContainer post={importedPost} onClose={closeImportedPost} />
      <PostVisibilityContainer reference={visibility} onClose={closePostVisibility} />

      <PromptComponent
        icon={'success'}
        open={openSuccessPrompt}
        onCancel={closeSendTipSuccessPrompt}
        title={'Success'}
        subtitle={
          <Typography component="div">
            Tip to{' '}
            {tippedContentForHistory &&
              ('platform' in tippedContentForHistory ? (
                <Box fontWeight={400} display="inline">
                  {tippedContentForHistory?.platform === 'myriad'
                    ? tippedContentForHistory?.user.name
                    : tippedContentForHistory?.people?.name ?? 'Unknown Myrian'}
                </Box>
              ) : (
                <Box fontWeight={400} display="inline">
                  {tippedContentForHistory.user.name ?? 'Unknown Myrian'}
                </Box>
              ))}{' '}
            sent successfully
          </Typography>
        }>
        <Grid container justifyContent="center">
          <a
            target="_blank"
            style={{textDecoration: 'none'}}
            href={explorerURL ?? 'https://myriad.social'}
            rel="noopener noreferrer">
            <Button style={{marginRight: '12px'}} size="small" variant="outlined" color="secondary">
              Transaction details
            </Button>
          </a>
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={closeSendTipSuccessPrompt}>
            Return
          </Button>
        </Grid>
      </PromptComponent>
    </>
  );
};
