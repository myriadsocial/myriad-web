import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Lottie from 'react-lottie';

import ShowIf from '../../components/common/show-if.component';
import LoadingAnimation from '../../lottie/loading.json';
import {PostDetail} from '../PostDetail';
import {DropdownMenu} from '../atoms/DropdownMenu';
import {FilterDropdownMenu} from '../atoms/FilterDropdownMenu/';
import {TabList} from '../atoms/TabList';
import {useStyles} from './Timeline.styles';
import {filterOptions, sortOptions, postFilterOptions} from './default';

import {Post} from 'src/interfaces/post';
import {TimelineSortMethod, TimelineType} from 'src/interfaces/timeline';

type TimelineProps = {
  posts: Post[];
  anonymous: boolean;
  filter?: boolean;
  sort?: 'metric' | 'filter';
  hasMore: boolean;
  loadNextPage: () => void;
  sortTimeline: (sort: TimelineSortMethod) => void;
  filterTimeline?: (type: TimelineType) => void;
};

export const Timeline: React.FC<TimelineProps> = props => {
  const {
    posts,
    anonymous,
    filter = true,
    sort = 'metric',
    hasMore,
    loadNextPage,
    sortTimeline,
    filterTimeline,
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

  return (
    <div className={styles.root}>
      <div className={styles.action}>
        {filter && (
          <TabList
            tabs={filterOptions}
            mark="underline"
            size="small"
            active="all"
            position="left"
            onChangeTab={handleFilter}
            className={styles.filter}
          />
        )}

        <ShowIf condition={sort == 'metric'}>
          <DropdownMenu title="Sort by" options={sortOptions} onChange={handleSort} />
        </ShowIf>

        <ShowIf condition={sort == 'filter'}>
          <FilterDropdownMenu title="Filter by" options={postFilterOptions} />
        </ShowIf>
      </div>

      <InfiniteScroll
        scrollableTarget="scrollable-timeline"
        dataLength={posts.length}
        hasMore={hasMore}
        next={loadNextPage}
        loader={<Lottie options={lottieLoading} height={50} width={50} />}>
        {posts.map(post => (
          <PostDetail key={`post-${post.id}`} post={post} anonymous={anonymous} />
        ))}
      </InfiniteScroll>
    </div>
  );
};
