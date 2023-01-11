import React, {useEffect} from 'react';
import {shallowEqual, useSelector} from 'react-redux';

import {Grid} from '@material-ui/core';

import {ExperienceCard} from './Render/ExperienceCard';
import {useStyles} from './Timeline.styles';
import {TimelineAutoReloader} from './TimelineAutoReloader';

import {PostsListContainer} from 'src/components/PostList';
import {TimelineFilterContainer} from 'src/components/TimelineFilter';
import {useExperienceHook} from 'src/hooks/use-experience-hook';
import {useQueryParams} from 'src/hooks/use-query-params.hooks';
import {User} from 'src/interfaces/user';
import {RootState} from 'src/reducers';

type TimelineContainerProps = {
  anonymous?: boolean;
};

export const Timeline: React.FC<TimelineContainerProps> = props => {
  const {query} = useQueryParams();
  const styles = useStyles();
  const {
    experience,
    getExperienceDetail,
    userExperiences,
    subscribeExperience,
    unsubscribeExperience,
  } = useExperienceHook();

  const user = useSelector<RootState, User>(state => state.userState.user, shallowEqual);

  useEffect(() => {
    window.history.scrollRestoration = 'manual';
  }, []);

  useEffect(() => {
    if (query.type === 'experience') {
      query.id && getExperienceDetail(query.id);
    }
  }, [query.id]);

  return (
    <>
      <div className={styles.box}>
        <Grid container justifyContent="space-between" alignItems="center">
          <TimelineFilterContainer filterType="type" selectionType="order" />
        </Grid>

        <TimelineAutoReloader />
        {query.type === 'experience' && experience && (
          <ExperienceCard
            experience={experience}
            userExperiences={userExperiences}
            user={user}
            onSubscribe={subscribeExperience}
            onUnsubscribe={unsubscribeExperience}
          />
        )}
        <PostsListContainer query={query} user={user} />
      </div>
    </>
  );
};
