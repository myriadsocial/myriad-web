import React from 'react';

import {PostDetail} from '../PostDetail';
import {DropdownMenu} from '../atoms/DropdownMenu';
import {TabList} from '../atoms/TabList';
import {useStyles} from './Timeline.styles';
import {filterOptions, sortOptions} from './default';

import {Post} from 'src/interfaces/post';

type TimelineProps = {
  posts: Post[];
  anonymous: boolean;
  allowFilter?: boolean;
};

export const Timeline: React.FC<TimelineProps> = props => {
  const {posts, anonymous, allowFilter = true} = props;

  const styles = useStyles();

  const handleFilter = (variant: string) => {
    // code
  };

  return (
    <div className={styles.root}>
      {allowFilter && (
        <div className={styles.action}>
          <TabList
            tabs={filterOptions}
            mark="underline"
            size="small"
            active="all"
            position="left"
            onChangeTab={handleFilter}
            className={styles.filter}
          />

          <DropdownMenu title="Sort by" options={sortOptions} />
        </div>
      )}

      {posts.map(post => (
        <PostDetail key={`post-${post.id}`} post={post} anonymous={anonymous} />
      ))}
    </div>
  );
};
