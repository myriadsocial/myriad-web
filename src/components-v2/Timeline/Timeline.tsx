import React from 'react';

import {PostDetail} from '../PostDetail';
import {FilterDropdownMenu} from '../atoms/FilterDropdownMenu/';
import {useStyles} from './Timeline.styles';
import {postFilterOptions} from './default';

import {Post} from 'src/interfaces/post';

type TimelineProps = {
  posts: Post[];
  anonymous: boolean;
  allowFilter?: boolean;
};

export const Timeline: React.FC<TimelineProps> = props => {
  const {posts, anonymous, allowFilter = true} = props;

  const styles = useStyles();

  return (
    <div className={styles.root}>
      {allowFilter && <FilterDropdownMenu title="Filter by" options={postFilterOptions} />}

      {posts.map(post => (
        <PostDetail key={`post-${post.id}`} post={post} anonymous={anonymous} />
      ))}
    </div>
  );
};
