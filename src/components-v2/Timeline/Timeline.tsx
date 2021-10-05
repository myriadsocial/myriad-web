import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Lottie from 'react-lottie';

import ShowIf from '../../components/common/show-if.component';
import {Post} from '../../interfaces/post';
import {TimelineSortMethod, TimelineType} from '../../interfaces/timeline';
import LoadingAnimation from '../../lottie/loading.json';
import {PostDetail} from '../PostDetail';
import {DropdownMenu} from '../atoms/DropdownMenu';
import {FilterDropdownMenu} from '../atoms/FilterDropdownMenu/';
import {TabList} from '../atoms/TabList';
import {useStyles} from './Timeline.styles';
import {filterOptions, sortOptions, postFilterOptions} from './default';

import {Comment} from 'src/interfaces/comment';
import {User} from 'src/interfaces/user';

type TimelineProps = {
  user?: User;
  posts: Post[];
  type: TimelineType;
  sort: TimelineSortMethod;
  anonymous: boolean;
  enableFilter?: boolean;
  sortType?: 'metric' | 'filter';
  hasMore: boolean;
  upvote: (refrence: Post | Comment) => void;
  loadNextPage: () => void;
  sortTimeline: (sort: TimelineSortMethod) => void;
  filterTimeline?: (type: TimelineType) => void;
  filterOrigin?: (origin: string) => void;
  onSendTip: (post: Post) => void;
  onOpenTipHistory: (post: Post) => void;
  onDelete: (post: Post) => void;
  onReport: (post: Post) => void;
  toggleDownvoting: (reference: Post | Comment | null) => void;
};

export const Timeline: React.FC<TimelineProps> = props => {
  const {
    user,
    posts,
    type,
    sort,
    anonymous,
    enableFilter = true,
    sortType = 'metric',
    hasMore,
    loadNextPage,
    sortTimeline,
    filterTimeline,
    filterOrigin,
    upvote,
    onSendTip,
    onOpenTipHistory,
    onDelete,
    onReport,
    toggleDownvoting,
  } = props;

  const styles = useStyles();
  const lottieLoading = {
    loop: true,
    autoplay: true,
    animationData: LoadingAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const handleSort = (sort: string) => {
    sortTimeline(sort as TimelineSortMethod);
  };

  const handleFilter = (variant: string) => {
    filterTimeline && filterTimeline(variant as TimelineType);
  };

  const handleFilterOrigin = (origin: string) => {
    filterOrigin && filterOrigin(origin);
  };

  return (
    <div className={styles.root}>
      <div className={styles.action}>
        {enableFilter && (
          <TabList
            tabs={filterOptions}
            active={type}
            mark="underline"
            size="small"
            position="left"
            onChangeTab={handleFilter}
            className={styles.filter}
          />
        )}

        <ShowIf condition={sortType == 'metric'}>
          <DropdownMenu
            title="Sort by"
            selected={sort}
            options={sortOptions}
            onChange={handleSort}
          />
        </ShowIf>

        <ShowIf condition={sortType == 'filter'}>
          <FilterDropdownMenu
            title="Filter by"
            selected={type}
            options={postFilterOptions}
            onChange={handleFilterOrigin}
          />
        </ShowIf>
      </div>

      <InfiniteScroll
        scrollableTarget="scrollable-timeline"
        dataLength={posts.length}
        hasMore={hasMore}
        next={loadNextPage}
        loader={<Lottie options={lottieLoading} height={50} width={50} />}>
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
          />
        ))}
      </InfiniteScroll>
    </div>
  );
};
