import { PencilIcon } from '@heroicons/react/outline';

import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import { IconButton, SvgIcon, useMediaQuery } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';

import { Skeleton as PostSkeleton } from '../PostDetail';
import { EmptyResult } from '../Search/EmptyResult';
import { EmptyContentEnum } from '../Search/EmptyResult.interfaces';
import { Loading } from '../atoms/Loading';
import { useStyles } from './PostList.styles';
import { useTimelineFilter } from './hooks/use-timeline-filter.hook';

import { PostDetailContainer } from 'components/PostDetail/PostDetail.container';
import ShowIf from 'components/common/show-if.component';
import { ParsedUrlQuery } from 'querystring';
import { useBlockList } from 'src/hooks/use-blocked-list.hook';
import { TimelineFilterFields } from 'src/interfaces/timeline';
import { TimelineType } from 'src/interfaces/timeline';
import { User } from 'src/interfaces/user';
import theme from 'src/themes/default';
import { useProfileFilter } from './hooks/use-profile-filter.hook';

const PostCreateContainer = dynamic(
  () => import('../PostCreate/PostCreate.container'),
  {
    ssr: false,
  },
);

type ProfilePostsListContainerProps = {
  query?: ParsedUrlQuery;
  filters?: TimelineFilterFields;
  user?: User;
  userId?: string;
};

export const ProfilePostsListContainer: React.FC<ProfilePostsListContainerProps> = props => {
  const { query, filters, user, userId } = props;
  const styles = useStyles();
  const { posts, loading, empty, hasMore, filterTimeline, nextPage, clear } = useProfileFilter(filters,userId);
  const { loadAll: loadAllBlockedUser } = useBlockList(user);

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const router = useRouter();
  const [createPostOpened, setCreatePostOpened] = useState(false);

  const handleOpenCreatePost = () => {
    setCreatePostOpened(true);
  };

  const handleCloseCreatePost = () => {
    setCreatePostOpened(false);
    if (query.type && query.type === TimelineType.ALL) {
      router.push('/', undefined, { shallow: true });
    }
  };

  useEffect(() => {
    clear();
    if (!user) filterTimeline({ ...query, timelineType: TimelineType.ALL });
    filterTimeline(query);

    loadAllBlockedUser();
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

  if (empty)
    return (
      <EmptyResult
        emptyContent={
          (query.type && query.type === TimelineType.EXPERIENCE) ||
          (!query.type && user)
            ? EmptyContentEnum.DISCOVER
            : EmptyContentEnum.POST
        }
      />
    );

  return (
    <div className={styles.root}>
      <PostCreateContainer
        open={createPostOpened}
        onClose={handleCloseCreatePost}
      />

      <ShowIf condition={!isMobile}>
        <div className={styles.button}>
          <IconButton
            onClick={handleOpenCreatePost}
            className={styles.iconbutton}>
            <SvgIcon
              className={styles.fill}
              component={PencilIcon}
              viewBox="0 0 28 28"
            />
          </IconButton>
        </div>
      </ShowIf>

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
