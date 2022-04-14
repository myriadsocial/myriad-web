import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import {Paper} from '@material-ui/core';

import {PostDetail} from '../PostDetail';
import {EmptyResult} from '../Search/EmptyResult';
import {EmptyContentEnum} from '../Search/EmptyResult.interfaces';
import {useFilterOption} from '../TimelineFilter/hooks/use-filter-option.hook';
import {DropdownMenu} from '../atoms/DropdownMenu';
import {Loading} from '../atoms/Loading';
import {useStyles} from './PostsList.styles';

import {Comment} from 'src/interfaces/comment';
import {Post} from 'src/interfaces/post';
import {TimelineOrderType} from 'src/interfaces/timeline';
import {User} from 'src/interfaces/user';

type PostsListProps = {
  user?: User;
  searchedPosts: Post[];
  anonymous: boolean;
  hasMore: boolean;
  order: TimelineOrderType;
  upvote: (reference: Post | Comment) => void;
  loadNextPage: () => void;
  onOpenTipHistory: (post: Post) => void;
  onReport: (post: Post) => void;
  onPostVisibility: (post: Post) => void;
  toggleDownvoting: (reference: Post | Comment | null) => void;
  onShared: (post: Post, type: 'link' | 'post') => void;
  onRemoveVote: (reference: Post | Comment) => void;
  onImporters: (post: Post) => void;
  onSort: (sort: TimelineOrderType) => void;
};

export const PostsList: React.FC<PostsListProps> = props => {
  const {
    user,
    searchedPosts,
    anonymous,
    hasMore,
    order,
    loadNextPage,
    upvote,
    onOpenTipHistory,
    onReport,
    onShared,
    onPostVisibility,
    toggleDownvoting,
    onRemoveVote,
    onImporters,
    onSort,
  } = props;
  const style = useStyles();
  const {orderOptions} = useFilterOption();

  return (
    <Paper className={style.root}>
      <div className={style.sort}>
        <DropdownMenu<TimelineOrderType>
          title="Sort by"
          selected={order}
          options={orderOptions}
          onChange={onSort}
        />
      </div>

      <InfiniteScroll
        scrollableTarget="scrollable-searched-posts"
        dataLength={searchedPosts.length}
        hasMore={hasMore}
        next={loadNextPage}
        loader={<Loading />}>
        {searchedPosts.length === 0 ? (
          <EmptyResult emptyContent={EmptyContentEnum.POST} />
        ) : (
          searchedPosts.map(post => (
            <PostDetail
              user={user}
              key={`post-${post.id}`}
              post={post}
              anonymous={anonymous}
              onUpvote={upvote}
              toggleDownvoting={toggleDownvoting}
              onOpenTipHistory={onOpenTipHistory}
              onReport={onReport}
              onShared={onShared}
              onRemoveVote={onRemoveVote}
              onVisibility={onPostVisibility}
              onImporters={onImporters}
            />
          ))
        )}
      </InfiniteScroll>
    </Paper>
  );
};
