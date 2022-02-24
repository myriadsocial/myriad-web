import React, {useState, useEffect} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import {Grid} from '@material-ui/core';

import {PostDetail} from '../PostDetail';
import {EmptyResult} from '../Search/EmptyResult';
import {EmptyContentEnum} from '../Search/EmptyResult.interfaces';
import {useFilterOption} from '../TimelineFilter/hooks/use-filter-option.hook';
import {DropdownMenu} from '../atoms/DropdownMenu';
import {Loading} from '../atoms/Loading';
import {useStyles} from './PostsList.styles';

import _ from 'lodash';
import {Comment} from 'src/interfaces/comment';
import {Post} from 'src/interfaces/post';
import {User} from 'src/interfaces/user';

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
  onPostVisibility: (post: Post) => void;
  toggleDownvoting: (reference: Post | Comment | null) => void;
  onShared: (post: Post, type: 'link' | 'post') => void;
  onRemoveVote: (reference: Post | Comment) => void;
  onImporters: (post: Post) => void;
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
    onPostVisibility,
    toggleDownvoting,
    onRemoveVote,
    onImporters,
  } = props;
  const style = useStyles();
  const {orderOptions} = useFilterOption();

  const [defaultPosts, setDefaultPosts] = useState<Post[]>([]);

  useEffect(() => {
    setDefaultPosts(searchedPosts);
  }, [searchedPosts]);

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
      <Grid container alignItems="center" justifyContent="flex-end" className={style.root}>
        <div className={style.sort}>
          <DropdownMenu
            title="Sort by"
            selected="created"
            options={orderOptions}
            onChange={handleSort}
          />
        </div>
        <div className={style.box} />
      </Grid>

      <InfiniteScroll
        scrollableTarget="scrollable-searched-posts"
        dataLength={searchedPosts.length}
        hasMore={hasMore}
        next={loadNextPage}
        loader={<Loading />}>
        {defaultPosts.length === 0 ? (
          <EmptyResult emptyContent={EmptyContentEnum.POST} />
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
              onVisibility={onPostVisibility}
              onImporters={onImporters}
            />
          ))
        )}
      </InfiniteScroll>
    </>
  );
};
