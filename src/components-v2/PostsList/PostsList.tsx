import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import {Loading} from '../../components-v2/atoms/Loading';
import {Comment} from '../../interfaces/comment';
import {Post} from '../../interfaces/post';
import {User} from '../../interfaces/user';
import {PostDetail} from '../PostDetail/';

type PostsListProps = {
  user?: User;
  searchedPosts: Post[];
  anonymous: boolean;
  hasMore: boolean;
  upvote: (reference: Post | Comment) => void;
  loadNextPage: () => void;
  onSendTip: (post: Post) => void;
  onOpenTipHistory: (post: Post) => void;
  onReport: (post: Post) => void;
  toggleDownvoting: (reference: Post | Comment | null) => void;
  onShared: (post: Post, type: 'link' | 'post') => void;
};

export const PostsList: React.FC<PostsListProps> = props => {
  const {
    user,
    searchedPosts,
    anonymous,
    hasMore,
    loadNextPage,
    upvote,
    onSendTip,
    onOpenTipHistory,
    onReport,
    onShared,
    toggleDownvoting,
  } = props;

  return (
    <>
      <InfiniteScroll
        scrollableTarget="scrollable-searched-posts"
        dataLength={searchedPosts.length}
        hasMore={hasMore}
        next={loadNextPage}
        loader={<Loading />}>
        {searchedPosts.map(post => (
          <PostDetail
            user={user}
            key={`post-${post.id}`}
            post={post}
            anonymous={anonymous}
            onUpvote={upvote}
            onSendTip={onSendTip}
            toggleDownvoting={toggleDownvoting}
            onOpenTipHistory={onOpenTipHistory}
            onReport={onReport}
            onShared={onShared}
          />
        ))}
      </InfiniteScroll>
    </>
  );
};
