import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {useRouter} from 'next/router';

import {Button, Grid} from '@material-ui/core';

import {PostDetail} from 'src/components-v2/PostDetail';
import {ReportContainer} from 'src/components-v2/Report';
import {SendTipContainer} from 'src/components-v2/SendTip';
import {useTimelineHook} from 'src/components-v2/Timeline/hooks/use-timeline.hook';
import {TipHistoryContainer} from 'src/components-v2/TipHistory';
import {Modal} from 'src/components-v2/atoms/Modal';
import {PromptComponent} from 'src/components-v2/atoms/Prompt/prompt.component';
import {useTipHistory} from 'src/hooks/tip-history.hook';
import {useToasterHook} from 'src/hooks/use-toaster.hook';
import {Comment} from 'src/interfaces/comment';
import {Post} from 'src/interfaces/post';
import {Status} from 'src/interfaces/toaster';
import {RootState} from 'src/reducers';
import {upvote, setDownvoting, deletePost, removeVote} from 'src/reducers/timeline/actions';
import {UserState} from 'src/reducers/user/reducer';

export const PostContainer: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const {postId} = router.query;
  const {getPostDetail, post, getTippedUserId} = useTimelineHook();
  const {user, anonymous} = useSelector<RootState, UserState>(state => state.userState);
  const {openTipHistory} = useTipHistory();
  const {openToaster} = useToasterHook();

  const [tippedPost, setTippedPost] = useState<Post | null>(null);
  const [removing, setRemoving] = useState(false);
  const [postToRemove, setPostToRemove] = useState<Post | null>(null);
  const [reported, setReported] = useState<Post | null>(null);
  const sendTipOpened = Boolean(tippedPost);

  useEffect(() => {
    if (postId) getPostDetail(postId);
  }, []);

  const handleUpvote = (reference: Post | Comment) => {
    dispatch(upvote(reference));
  };

  const handleSendTip = (reference?: Post | Comment) => {
    // type guard to check if reference is a Post object
    if (reference && 'platform' in reference) {
      setTippedPost(reference);
      getTippedUserId(reference.id);
    }
  };

  const handleToggleDownvoting = (reference: Post | Comment | null) => {
    dispatch(setDownvoting(reference));
  };

  const handleDeletePost = (post: Post) => {
    setRemoving(true);
    setPostToRemove(post);
  };

  const handleReportPost = (post: Post) => {
    setReported(post);
  };

  const handleSharePost = (post: Post, type: 'link' | 'post') => {
    if (type === 'post') {
      openToaster({
        message: 'This post successfully share to your timeline',
        toasterStatus: Status.SUCCESS,
      });
    }
  };

  const closeSendTip = () => {
    setTippedPost(null);
  };

  const closeReportPost = () => {
    setReported(null);
  };

  const handleClosePrompt = (): void => {
    setRemoving(false);
    setPostToRemove(null);
  };

  const confirmDeletePost = (): void => {
    if (postToRemove) {
      dispatch(deletePost(postToRemove.id));
    }

    handleClosePrompt();
  };

  const handleRemoveVote = (reference: Post | Comment) => {
    dispatch(removeVote(reference));
  };

  if (!post) return null;

  return (
    <div>
      <PostDetail
        user={user}
        key={`post-${post.id}`}
        post={post}
        anonymous={anonymous}
        onUpvote={handleUpvote}
        onSendTip={handleSendTip}
        toggleDownvoting={handleToggleDownvoting}
        onOpenTipHistory={openTipHistory}
        onDelete={handleDeletePost}
        onReport={handleReportPost}
        onShared={handleSharePost}
        onRemoveVote={handleRemoveVote}
        expanded
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

      <PromptComponent
        title={'Remove Post'}
        subtitle={`Are you sure to remove this post?`}
        open={removing}
        icon="danger"
        onCancel={handleClosePrompt}>
        <Grid container justifyContent="space-between">
          <Button size="small" variant="outlined" color="secondary" onClick={handleClosePrompt}>
            No, let me rethink
          </Button>
          <Button size="small" variant="contained" color="primary" onClick={confirmDeletePost}>
            Yes, proceed to delete
          </Button>
        </Grid>
      </PromptComponent>
    </div>
  );
};
