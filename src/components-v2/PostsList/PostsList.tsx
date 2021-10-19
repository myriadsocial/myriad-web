import React, {useState, useEffect} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import {Loading} from '../../components-v2/atoms/Loading';
import {Comment} from '../../interfaces/comment';
import {Post} from '../../interfaces/post';
import {User} from '../../interfaces/user';
import {PostDetail} from '../PostDetail/';
import {sortOptions} from '../Timeline/default';
import {DropdownMenu} from '../atoms/DropdownMenu';

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

  useEffect(() => {
    setDefaultPosts(searchedPosts);
  }, [searchedPosts]);

  const [defaultPosts, setDefaultPosts] = useState<Post[]>([]);

  console.log({defaultPosts});

  const handleSort = (sort: string) => {
    console.log({sort});
    switch (sort) {
      case 'created': {
        const sortedByLatest = _.orderBy(defaultPosts, 'createdAt', 'desc');
        setDefaultPosts(sortedByLatest);
        break;
      }

      case 'trending': {
        break;
      }

      case 'like': {
        const sortedByMostLiked = _.orderBy(defaultPosts, 'metric.upvotes', 'desc');
        setDefaultPosts(sortedByMostLiked);
        break;
      }

      case 'comment': {
        const sortedByMostCommented = _.orderBy(defaultPosts, 'metric.comments', 'desc');
        setDefaultPosts(sortedByMostCommented);
        break;
      }

      default: {
        break;
      }
    }
  };

  return (
    <>
      <DropdownMenu
        title="Sort by"
        selected={sortOptions[0].id}
        options={sortOptions}
        onChange={handleSort}
      />
      <InfiniteScroll
        scrollableTarget="scrollable-searched-posts"
        dataLength={searchedPosts.length}
        hasMore={hasMore}
        next={loadNextPage}
        loader={<Loading />}>
        {defaultPosts.map(post => (
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
