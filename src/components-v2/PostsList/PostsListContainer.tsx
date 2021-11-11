import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {ReportContainer} from '../Report';
import {SendTipContainer} from '../SendTip';
import {useTimelineHook} from '../Timeline/hooks/use-timeline.hook';
import {TipHistoryContainer} from '../TipHistory';
import {Modal} from '../atoms/Modal';
import {PostsList} from './PostsList';

import {useTipHistory} from 'src/hooks/tip-history.hook';
import {useToasterHook} from 'src/hooks/use-toaster.hook';
import {Comment} from 'src/interfaces/comment';
import {Post} from 'src/interfaces/post';
import {Status} from 'src/interfaces/toaster';
import {User} from 'src/interfaces/user';
import {RootState} from 'src/reducers';
import {upvote, setDownvoting, removeVote} from 'src/reducers/timeline/actions';
import {WalletState} from 'src/reducers/wallet/reducer';

type PostsListContainerProps = {
  anonymous?: boolean;
};

export const PostsListContainer: React.FC<PostsListContainerProps> = props => {
  const {anonymous = false} = props;

  const dispatch = useDispatch();

  const {posts, hasMore, nextPage, getTippedUserId} = useTimelineHook();
  const {openTipHistory} = useTipHistory();
  const {openToaster} = useToasterHook();

  const {isTipSent} = useSelector<RootState, WalletState>(state => state.walletState);

  useEffect(() => {
    if (isTipSent) {
      closeSendTip();
    }
  }, [isTipSent]);

  const user = useSelector<RootState, User | undefined>(state => state.userState.user);
  const [tippedPost, setTippedPost] = useState<Post | null>(null);

  const [reported, setReported] = useState<Post | null>(null);
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

  const closeSendTip = () => {
    if (isTipSent && tippedPost) {
      openTipHistory(tippedPost);
    } else {
      console.log('no post tipped');
    }
    setTippedPost(null);
  };

  const handleReportPost = (post: Post) => {
    setReported(post);
  };

  const closeReportPost = () => {
    setReported(null);
  };

  const handleSharePost = (post: Post, type: 'link' | 'post') => {
    if (type === 'post') {
      openToaster({
        message: 'This post successfully share to your timeline',
        toasterStatus: Status.SUCCESS,
      });
    }
  };

  const handleToggleDownvoting = (reference: Post | Comment | null) => {
    dispatch(setDownvoting(reference));
  };

  const handleRemoveVote = (reference: Post | Comment) => {
    dispatch(removeVote(reference));
  };

  return (
    <>
      <PostsList
        user={user}
        anonymous={anonymous}
        loadNextPage={nextPage}
        hasMore={hasMore}
        upvote={handleUpvote}
        onSendTip={handleSendTip}
        onOpenTipHistory={openTipHistory}
        onReport={handleReportPost}
        toggleDownvoting={handleToggleDownvoting}
        onShared={handleSharePost}
        searchedPosts={posts}
        onRemoveVote={handleRemoveVote}
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
    </>
  );
};
