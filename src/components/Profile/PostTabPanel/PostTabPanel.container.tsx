import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {useRouter} from 'next/router';

import {Button} from '@material-ui/core';

import {DropdownMenu} from '../../atoms/DropdownMenu';
import {sortOptions} from './default';

import {PostVisibilityContainer} from 'src/components/PostVisibility';
import {ReportContainer} from 'src/components/Report';
import {SendTipContainer} from 'src/components/SendTip';
import {Timeline as TimelineComponent} from 'src/components/Timeline';
import {useTimelineFilter} from 'src/components/Timeline/hooks/use-timeline-filter.hook';
import {useTimelineHook} from 'src/components/Timeline/hooks/use-timeline.hook';
import {TimelineFilterContainer} from 'src/components/TimelineFilter';
import {TipHistoryContainer} from 'src/components/TipHistory';
import {Empty} from 'src/components/atoms/Empty';
import {Modal} from 'src/components/atoms/Modal';
import {PromptComponent} from 'src/components/atoms/Prompt/prompt.component';
import {useTipHistory} from 'src/hooks/tip-history.hook';
import {useQueryParams} from 'src/hooks/use-query-params.hooks';
import {useToasterSnackHook} from 'src/hooks/use-toaster-snack.hook';
import {Comment} from 'src/interfaces/comment';
import {Post} from 'src/interfaces/post';
import {TimelineFilter} from 'src/interfaces/timeline';
import {User} from 'src/interfaces/user';
import {RootState} from 'src/reducers';
import {upvote, setDownvoting, deletePost, removeVote} from 'src/reducers/timeline/actions';

type TimelineContainerProps = {
  filters?: TimelineFilter;
  enableFilter?: boolean;
  sortType?: 'metric' | 'filter';
  anonymous?: boolean;
};

export const PostTabPanel: React.FC<TimelineContainerProps> = props => {
  const {anonymous = false, filters} = props;
  const router = useRouter();

  const dispatch = useDispatch();
  const {posts, hasMore, nextPage, getTippedUserId} = useTimelineHook();
  const {filterTimeline} = useTimelineFilter(filters);
  const {query} = useQueryParams();
  const {openTipHistory} = useTipHistory();
  const {openToasterSnack} = useToasterSnackHook();

  const user = useSelector<RootState, User | undefined>(state => state.userState.user);
  const [tippedPost, setTippedPost] = useState<Post | null>(null);
  const [reported, setReported] = useState<Post | null>(null);
  const [removing, setRemoving] = useState(false);
  const [postToRemove, setPostToRemove] = useState<Post | null>(null);
  const sendTipOpened = Boolean(tippedPost);
  const [visibility, setVisibility] = useState<Post | null>(null);

  const [toggle, setToggle] = useState<string>('');
  const [postsList, setPostsList] = useState<Post[]>([]);

  useEffect(() => {
    filterTimeline(query);
  }, [query]);

  useEffect(() => {
    setPostsList(posts);
  }, [posts, toggle]);

  const handleUpvote = (reference: Post | Comment) => {
    dispatch(upvote(reference));
  };

  const handleToggleDownvoting = (reference: Post | Comment | null) => {
    dispatch(setDownvoting(reference));
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

  const handleDeletePost = (post: Post) => {
    setRemoving(true);
    setPostToRemove(post);
  };

  const handleSharePost = (post: Post, type: 'link' | 'post') => {
    if (type === 'post') {
      openToasterSnack({
        message: 'This post successfully share to your timeline',
        variant: 'success',
      });
    }
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

  const handleGoHome = () => {
    router.push('/home');
  };

  const handlePostVisibility = (post: Post) => {
    setVisibility(post);
  };

  const closePostVisibility = () => {
    setVisibility(null);
  };

  if (!posts.length && filters?.owner === user?.id) {
    return (
      <Empty title="Looks like you haven’t posted yet">
        <Button onClick={handleGoHome} variant="contained" size="small" color="primary">
          Create my first post
        </Button>
      </Empty>
    );
  }
  const handleSortChanged = (sort: string) => {
    console.log(sort, 'sooort');
    let sortPosts;
    setToggle(sort);
    switch (sort) {
      case 'latest':
        sortPosts = postsList.sort((a, b) => {
          if (new Date(a.createdAt) < new Date(b.createdAt)) return 1;
          if (new Date(a.createdAt) > new Date(b.createdAt)) return -1;
          return 0;
        });
        setPostsList(sortPosts);
        break;
      case 'oldest':
        sortPosts = postsList.sort((a, b) => {
          if (new Date(a.createdAt) < new Date(b.createdAt)) return -1;
          if (new Date(a.createdAt) > new Date(b.createdAt)) return 1;
          return 0;
        });
        setPostsList(sortPosts);
        break;
      default:
        break;
    }
  };

  if (!posts.length) {
    return <Empty title="No post yet" subtitle="This user hasn’t posted anything" />;
  }

  return (
    <>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <TimelineFilterContainer {...props} />
        <DropdownMenu title={'Sort by'} options={sortOptions} onChange={handleSortChanged} />
      </div>

      <TimelineComponent
        user={user}
        posts={postsList}
        anonymous={anonymous}
        loadNextPage={nextPage}
        hasMore={hasMore}
        upvote={handleUpvote}
        onSendTip={handleSendTip}
        onOpenTipHistory={openTipHistory}
        onDelete={handleDeletePost}
        onReport={handleReportPost}
        onVisibility={handlePostVisibility}
        toggleDownvoting={handleToggleDownvoting}
        onShared={handleSharePost}
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
    </>
  );
};
