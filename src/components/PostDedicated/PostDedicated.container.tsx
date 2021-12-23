import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {useRouter} from 'next/router';

import {Button} from '@material-ui/core';

import {PostDetail} from 'src/components/PostDetail';
import {PostImporterContainer} from 'src/components/PostImporterList';
import {PostVisibilityContainer} from 'src/components/PostVisibility';
import {ReportContainer} from 'src/components/Report';
import {SendTipContainer} from 'src/components/SendTip';
import {useTimelineHook} from 'src/components/Timeline/hooks/use-timeline.hook';
import {TipHistoryContainer} from 'src/components/TipHistory';
import {Modal} from 'src/components/atoms/Modal';
import {PromptComponent} from 'src/components/atoms/Prompt/prompt.component';
import {useTipHistory} from 'src/hooks/tip-history.hook';
import {useToasterSnackHook} from 'src/hooks/use-toaster-snack.hook';
import {Comment} from 'src/interfaces/comment';
import {Post} from 'src/interfaces/post';
import {RootState} from 'src/reducers';
import {removeImporter} from 'src/reducers/importers/actions';
import {upvote, setDownvoting, deletePost, removeVote} from 'src/reducers/timeline/actions';
import {UserState} from 'src/reducers/user/reducer';

type PostContainerProps = {
  type?: 'share' | 'default';
  expanded?: boolean;
};

export const PostContainer: React.FC<PostContainerProps> = props => {
  const {type = 'default', expanded = true} = props;

  const dispatch = useDispatch();
  const router = useRouter();
  const [visibility, setVisibility] = useState<Post | null>(null);

  const {post, getTippedUserId} = useTimelineHook();
  const {user, anonymous} = useSelector<RootState, UserState>(state => state.userState);
  const {openTipHistory} = useTipHistory();

  const {openToasterSnack} = useToasterSnackHook();

  const [tippedPost, setTippedPost] = useState<Post | null>(null);
  const [removing, setRemoving] = useState(false);
  const [postToRemove, setPostToRemove] = useState<Post | null>(null);
  const [reported, setReported] = useState<Post | null>(null);
  const [importedPost, setImportedPost] = useState<Post | null>(null);
  const sendTipOpened = Boolean(tippedPost);

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

  const handleImporters = (post: Post) => {
    dispatch(removeImporter());
    setImportedPost(post);
  };

  const closeImportedPost = () => {
    setImportedPost(null);
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
    handleClosePrompt();

    if (postToRemove) {
      dispatch(
        deletePost(postToRemove.id, () => {
          router.push('/home');
        }),
      );
    }
  };

  const handleRemoveVote = (reference: Post | Comment) => {
    dispatch(removeVote(reference));
  };

  const handlePostVisibility = (post: Post) => {
    setVisibility(post);
  };

  const closePostVisibility = () => {
    setVisibility(null);
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
        onImporters={handleImporters}
        onShared={handleSharePost}
        onRemoveVote={handleRemoveVote}
        onVisibility={handlePostVisibility}
        expanded={expanded}
        type={type}
      />

      <Modal
        gutter="none"
        open={sendTipOpened}
        onClose={closeSendTip}
        title="Send Tip"
        subtitle="Find this post insightful? Send a tip!">
        <SendTipContainer />
      </Modal>

      <TipHistoryContainer onSendTip={handleSendTip} />

      <ReportContainer reference={reported} onClose={closeReportPost} />
      <PostImporterContainer post={importedPost} onClose={closeImportedPost} />
      <PostVisibilityContainer reference={visibility} onClose={closePostVisibility} />

      <PromptComponent
        title={'Remove Post'}
        subtitle={`Are you sure to remove this post?`}
        open={removing}
        icon="danger"
        onCancel={handleClosePrompt}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}>
          <Button
            style={{marginRight: '12px'}}
            size="small"
            variant="outlined"
            color="secondary"
            onClick={handleClosePrompt}>
            No, let me rethink
          </Button>
          <Button size="small" variant="contained" color="primary" onClick={confirmDeletePost}>
            Yes, proceed to delete
          </Button>
        </div>
      </PromptComponent>
    </div>
  );
};
