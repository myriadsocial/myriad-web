import React from 'react';

import {Grid} from '@material-ui/core';

import {PostsListContainer} from 'src/components/PostList';
import {TimelineFilterContainer} from 'src/components/TimelineFilter';

type TimelineContainerProps = {
  anonymous?: boolean;
};

export const Timeline: React.FC<TimelineContainerProps> = props => {
  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <TimelineFilterContainer filterType="type" selectionType="order" />
      </Grid>

      <PostsListContainer />
    </>
  );
};
