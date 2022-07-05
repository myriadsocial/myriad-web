import React, {useEffect} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {shallowEqual, useSelector} from 'react-redux';

import Grid from '@material-ui/core/Grid';

import {Skeleton as PostSkeleton} from '../PostDetail';
import {EmptyResult} from '../Search/EmptyResult';
import {EmptyContentEnum} from '../Search/EmptyResult.interfaces';
import {Loading} from '../atoms/Loading';
import {useStyles} from './PostList.styles';
import {useTimelineFilter} from './hooks/use-timeline-filter.hook';

import {PostDetailContainer} from 'components/PostDetail/PostDetail.container';
import {ParsedUrlQuery} from 'querystring';
import {TimelineFilterFields} from 'src/interfaces/timeline';
import {User} from 'src/interfaces/user';
import {RootState} from 'src/reducers';

type PostsListContainerProps = {
  query?: ParsedUrlQuery;
  filters?: TimelineFilterFields;
};

export const PostsListContainer: React.FC<PostsListContainerProps> = props => {
  const {query, filters} = props;
  const styles = useStyles();

  const {posts, loading, empty, hasMore, filterTimeline, nextPage} = useTimelineFilter(filters);
  const user = useSelector<RootState, User>(state => state.userState.user, shallowEqual);

  useEffect(() => {
    filterTimeline(query);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const loadNextPage = () => {
    nextPage();
  };

  if (loading)
    return (
      <Grid container justifyContent="center">
        <PostSkeleton />
        <PostSkeleton />
      </Grid>
    );

  if (empty) return <EmptyResult emptyContent={EmptyContentEnum.POST} />;

  return (
    <div className={styles.root}>
      <InfiniteScroll
        dataLength={posts.length}
        hasMore={hasMore}
        next={loadNextPage}
        loader={<Loading />}>
        <Grid container direction="column">
          {posts.map(post => (
            <PostDetailContainer
              key={`post-${post.id}`}
              user={user}
              post={post}
              votes={post.metric.upvotes - post.metric.downvotes}
            />
          ))}
        </Grid>
      </InfiniteScroll>
    </div>
  );
};
