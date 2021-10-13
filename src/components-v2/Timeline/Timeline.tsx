import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import {PostDetail} from '../PostDetail';
import {useStyles} from './Timeline.styles';

import {Loading} from 'src/components-v2/atoms/Loading';
import {Comment} from 'src/interfaces/comment';
import {Post} from 'src/interfaces/post';
import {User} from 'src/interfaces/user';

type TimelineProps = {
  user?: User;
  posts: Post[];
  anonymous: boolean;
  hasMore: boolean;
  upvote: (refrence: Post | Comment) => void;
  loadNextPage: () => void;
  onSendTip: (post: Post) => void;
  onOpenTipHistory: (post: Post) => void;
  onDelete: (post: Post) => void;
  onReport: (post: Post) => void;
  toggleDownvoting: (reference: Post | Comment | null) => void;
  onShared: (post: Post, type: 'link' | 'post') => void;
};

export const Timeline: React.FC<TimelineProps> = props => {
  const {
    user,
    posts,
    anonymous,
    hasMore,
    loadNextPage,
    upvote,
    onSendTip,
    onOpenTipHistory,
    onDelete,
    onReport,
    onShared,
    toggleDownvoting,
  } = props;

  const styles = useStyles();

  return (
    <div className={styles.root}>
      <InfiniteScroll
        scrollableTarget="scrollable-timeline"
        dataLength={posts.length}
        hasMore={hasMore}
        next={loadNextPage}
        loader={<Loading />}>
        {posts.map(post => (
          <PostDetail
            user={user}
            key={`post-${post.id}`}
            post={post}
            anonymous={anonymous}
            onUpvote={upvote}
            onSendTip={onSendTip}
            toggleDownvoting={toggleDownvoting}
            onOpenTipHistory={onOpenTipHistory}
            onDelete={onDelete}
            onReport={onReport}
            onShared={onShared}
          />
        ))}
      </InfiniteScroll>
    </div>
  );
};
