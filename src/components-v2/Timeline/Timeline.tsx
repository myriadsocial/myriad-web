import React from 'react';

import {PostDetail} from '../PostDetail';
import {useStyles} from './Timeline.styles';

import {Post} from 'src/interfaces/post';

type TimelineProps = {
  posts: Post[];
  anonymous: boolean;
};

export const Timeline: React.FC<TimelineProps> = props => {
  const {posts, anonymous} = props;

  const styles = useStyles();

  return (
    <div className={styles.root}>
      {posts.map(post => (
        <PostDetail key={`post-${post.id}`} post={post} anonymous={anonymous} />
      ))}
    </div>
  );
};
