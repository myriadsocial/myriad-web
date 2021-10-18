import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {useTipHistory} from '../../hooks/tip-history.hook';
import {useToasterHook} from '../../hooks/use-toaster.hook';
import {Post} from '../../interfaces/post';
import {Status} from '../../interfaces/toaster';
import {User} from '../../interfaces/user';
import {upvote, setDownvoting} from '../../reducers/timeline/actions';
import {ReportContainer} from '../Report';
import {SendTipContainer} from '../SendTip';
import {useTimelineHook} from '../Timeline/hooks/use-timeline.hook';
import {TipHistoryContainer} from '../TipHistory';
import {Modal} from '../atoms/Modal';
import {PostsList} from './PostsList';

import {Comment} from 'src/interfaces/comment';
import {RootState} from 'src/reducers';

type PostsListContainerProps = {
  anonymous?: boolean;
};

export const PostsListContainer: React.FC<PostsListContainerProps> = props => {
  const {anonymous = false} = props;

  const dispatch = useDispatch();

  const {searchedPosts: posts, hasMore, nextPage, getTippedUserId} = useTimelineHook();
  const {openTipHistory} = useTipHistory();
  const {openToaster} = useToasterHook();

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
