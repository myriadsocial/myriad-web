import React, {useState, useEffect} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import Typography from '@material-ui/core/Typography';

import {Loading} from '../../components-v2/atoms/Loading';
import NoPostFoundIcon from '../../images/no_post_found.svg';
import {Comment} from '../../interfaces/comment';
import {Post} from '../../interfaces/post';
import {User} from '../../interfaces/user';
import {PostDetail} from '../PostDetail/';
import {sortOptions} from '../Timeline/default';
import {DropdownMenu} from '../atoms/DropdownMenu';

import _ from 'lodash';

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
  onRemoveVote: (reference: Post | Comment) => void;
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
    onRemoveVote,
  } = props;

  useEffect(() => {
    setDefaultPosts(searchedPosts);
  }, [searchedPosts]);

  const [defaultPosts, setDefaultPosts] = useState<Post[]>([]);

  const handleSort = (sort: string) => {
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
      <div style={{marginBottom: 12}}>
        <DropdownMenu
          title="Sort by"
          selected={sortOptions[0].id}
          options={sortOptions}
          onChange={handleSort}
        />
      </div>
      <InfiniteScroll
        scrollableTarget="scrollable-searched-posts"
        dataLength={searchedPosts.length}
        hasMore={hasMore}
        next={loadNextPage}
        loader={<Loading />}>
        {defaultPosts.length === 0 ? (
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', rowGap: 12}}>
            <NoPostFoundIcon />
            <Typography variant="h4" style={{fontWeight: 'bold'}}>
              We can’t find any related users
            </Typography>
            <div style={{textAlign: 'center', fontWeight: 'normal'}}>
              <Typography variant="h6">
                Make sure you type correctly <br /> or try different keywords.
              </Typography>
            </div>
          </div>
        ) : (
          defaultPosts.map(post => (
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
              onRemoveVote={onRemoveVote}
            />
          ))
        )}
      </InfiniteScroll>
    </>
  );
};
