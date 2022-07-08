import React, {useEffect} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {useDispatch} from 'react-redux';

import Grid from '@material-ui/core/Grid';

import {Skeleton as PostSkeleton} from '../PostDetail';
import {EmptyResult} from '../Search/EmptyResult';
import {EmptyContentEnum} from '../Search/EmptyResult.interfaces';
import {Loading} from '../atoms/Loading';
import {useStyles} from './PostList.styles';
import {useTimelineFilter} from './hooks/use-timeline-filter.hook';

import {PostDetailContainer} from 'components/PostDetail/PostDetail.container';
import {ParsedUrlQuery} from 'querystring';
import {useBlockList} from 'src/hooks/use-blocked-list.hook';
import {TimelineFilterFields} from 'src/interfaces/timeline';
import {User} from 'src/interfaces/user';
import {loadUsers} from 'src/reducers/search/actions';

type PostsListContainerProps = {
  query?: ParsedUrlQuery;
  filters?: TimelineFilterFields;
  user?: User;
};

export const PostsListContainer: React.FC<PostsListContainerProps> = props => {
  const {query, filters, user} = props;
  const styles = useStyles();
  const dispatch = useDispatch();

  const {posts, loading, empty, hasMore, filterTimeline, nextPage} = useTimelineFilter(filters);
  const {loadAll: loadAllBlockedUser} = useBlockList(user);

  useEffect(() => {
    filterTimeline(query);

    loadAllBlockedUser();
    dispatch(loadUsers());
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
        {posts.map(post => (
          <PostDetailContainer
            key={`post-${post.id}`}
            user={user}
            post={post}
            metric={post.metric}
          />
        ))}
      </InfiniteScroll>
    </div>
  );
};
