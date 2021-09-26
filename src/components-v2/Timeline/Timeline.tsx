import React from 'react';

import ShowIf from '../../components/common/show-if.component';
import {PostDetail} from '../PostDetail';
import {DropdownMenu} from '../atoms/DropdownMenu';
import {FilterDropdownMenu} from '../atoms/FilterDropdownMenu/';
import {TabList} from '../atoms/TabList';
import {useStyles} from './Timeline.styles';
import {filterOptions, sortOptions, postFilterOptions} from './default';

import {Post} from 'src/interfaces/post';

type TimelineProps = {
  posts: Post[];
  anonymous: boolean;
  filter?: boolean;
  sort?: 'metric' | 'filter';
};

export const Timeline: React.FC<TimelineProps> = props => {
  const {posts, anonymous, filter = true, sort = 'metric'} = props;

  const styles = useStyles();

  const handleFilter = (variant: string) => {
    // code
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
          <DropdownMenu title="Sort by" options={sortOptions} />
        </ShowIf>

        <ShowIf condition={sort == 'filter'}>
          <FilterDropdownMenu title="Filter by" options={postFilterOptions} />
        </ShowIf>
      </div>

      {posts.map(post => (
        <PostDetail key={`post-${post.id}`} post={post} anonymous={anonymous} />
      ))}
    </div>
  );
};
