import React from 'react';
import {shallowEqual, useSelector} from 'react-redux';

import {Grid} from '@material-ui/core';

import {useStyles} from './Timeline.styles';
import {TimelineAutoReloader} from './TimelineAutoReloader';

import {PostsListContainer} from 'src/components/PostList';
import {TimelineFilterContainer} from 'src/components/TimelineFilter';
import {useQueryParams} from 'src/hooks/use-query-params.hooks';
import {User} from 'src/interfaces/user';
import {RootState} from 'src/reducers';

type TimelineContainerProps = {
  anonymous?: boolean;
};

export const Timeline: React.FC<TimelineContainerProps> = props => {
  const {query} = useQueryParams();
  const styles = useStyles();

  const user = useSelector<RootState, User>(state => state.userState.user, shallowEqual);

  return (
    <div className={styles.box}>
      <Grid container justifyContent="space-between" alignItems="center">
        <TimelineFilterContainer filterType="type" selectionType="order" />
      </Grid>

      <TimelineAutoReloader />

      <PostsListContainer query={query} user={user} />
    </div>
  );
};
