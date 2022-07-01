import React, {useEffect} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {shallowEqual, useSelector} from 'react-redux';

import Grid from '@material-ui/core/Grid';

import {Skeleton as PostSkeleton} from '../PostDetail';
import {EmptyResult} from '../Search/EmptyResult';
import {EmptyContentEnum} from '../Search/EmptyResult.interfaces';
import {useTimelineHook} from '../Timeline/hooks/use-timeline.hook';
import {Loading} from '../atoms/Loading';
import {PostDetailContainer} from './PostDetail.container';
import {usePostInteractionHook} from './hooks/use-post-interaction.hook';
import {useTimelineFilter} from './hooks/use-timeline-filter.hook';

import {ParsedUrlQuery} from 'querystring';
import {getAuthInfo} from 'src/reducers/user/selector';

type PostsListContainerProps = {
  query?: ParsedUrlQuery;
};

export const PostsListContainer: React.FC<PostsListContainerProps> = props => {
  const {query} = props;

  const {loading, posts, hasMore} = useTimelineHook();
  const {filterTimeline} = useTimelineFilter();
  const {upvotePost, toggleDownvotePost, removePostVote} = usePostInteractionHook();
  const {user} = useSelector(getAuthInfo, shallowEqual);

  useEffect(() => {
    filterTimeline(query);
  }, [query]);

  const loadNextPage = () => {
    console.log('filters', query);
  };

  if (loading && posts.length === 0)
    return (
      <Grid container justifyContent="center">
        <PostSkeleton />
        <PostSkeleton />
      </Grid>
    );

  if (!loading && posts.length === 0) return <EmptyResult emptyContent={EmptyContentEnum.POST} />;

  return (
    <>
      <InfiniteScroll
        dataLength={posts.length}
        hasMore={hasMore}
        next={loadNextPage}
        loader={<Loading />}>
        {posts.map(post => (
          <div key={`post-${post.id}`}>
            <PostDetailContainer
              user={user}
              post={post}
              votes={post.metric.upvotes - post.metric.downvotes}
              onDelete={console.log}
              onUpvote={upvotePost}
              onToggleDownvote={toggleDownvotePost}
              onRemoveVote={removePostVote}
              onOpenTipHistory={console.log}
              onReport={console.log}
              onShare={console.log}
              onChangeVisibility={console.log}
              onShowImporters={console.log}
            />

            <div>HA</div>
          </div>
        ))}
      </InfiniteScroll>
    </>
  );
};
