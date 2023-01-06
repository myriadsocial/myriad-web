import React, {useEffect} from 'react';
import {shallowEqual, useSelector} from 'react-redux';

import getConfig from 'next/config';
import Head from 'next/head';
import {useRouter} from 'next/router';

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
  const {publicRuntimeConfig} = getConfig();
  const router = useRouter();
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
      <Head>
        <title>{experience?.name}</title>
        <meta property="og:type" content="article" />
        <meta property="og:url" content={publicRuntimeConfig.appAuthURL + router.asPath} />
        <meta property="og:description" content={experience?.description} />
        <meta property="og:title" content={experience?.name} />
        <meta property="og:image" content={experience?.experienceImageURL} />
        <meta property="og:image:width" content="2024" />
        <meta property="og:image:height" content="1012" />
        <meta property="og:image:secure_url" content={experience?.experienceImageURL} />
        {/* Twitter Card tags */}
        <meta name="twitter:title" content={experience?.name} />
        <meta name="twitter:description" content={experience?.description} />
        <meta name="twitter:image" content={experience?.experienceImageURL} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
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
