import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { useRouter } from 'next/router';

import { Button } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { Skeleton } from '../../Expericence';
import { useStyles } from './Tab.style';

import { useFilterOption } from 'components/TimelineFilter/hooks/use-filter-option.hook';
import { DropdownMenu } from 'components/atoms/DropdownMenu';
import { ExperienceListContainer } from 'src/components/ExperienceList';
import ShowIf from 'src/components/common/show-if.component';
import {
  ExperienceOwner,
  useExperienceHook,
} from 'src/hooks/use-experience-hook';
import { Experience } from 'src/interfaces/experience';
import { TimelineFilterCreated } from 'src/interfaces/timeline';
import { ListMeta } from 'src/lib/api/interfaces/base-list.interface';
import i18n from 'src/locale';
import { RootState } from 'src/reducers';

export const TrendingExperienceTab: React.FC = () => {
  const styles = useStyles();
  const router = useRouter();
  const { loadTrendingExperience, loading } = useExperienceHook();
  const { createdFilter } = useFilterOption();

  const trendingExperiences = useSelector<RootState, Experience[]>(
    state => state.experienceState.trendingExperiences,
    shallowEqual,
  );

  const trendingExperiencesMeta = useSelector<RootState, ListMeta>(
    state => state.experienceState.meta,
    shallowEqual,
  );

  React.useEffect(() => {
    loadTrendingExperience();
  }, []);

  const handleViewAll = () => {
    router.push('/search?type=experience&q=', undefined, { shallow: true });
  };

  return (
    <div className={styles.box}>
      <div className={styles.flex}>
        <Typography variant={'h5'} className={styles.title}>
          {trendingExperiencesMeta?.totalItemCount ?? 0} Timelines
        </Typography>

        <DropdownMenu<TimelineFilterCreated>
          title={i18n.t('Post_Sorting.Title_Filter')}
          options={createdFilter}
          onChange={() => null}
          marginTop={false}
          marginBottom={false}
          placeholder={'Select'}
        />
      </div>
      <ExperienceListContainer
        noButton
        selectable
        enableClone
        enableSubscribe
        filterTimeline
        owner={ExperienceOwner.TRENDING}
      />
      <div style={{ width: '100%', textAlign: 'center' }}>
        <Button
          variant="text"
          style={{ width: 'auto', height: 'auto', padding: 1, margin: 'auto' }}
          color="primary"
          onClick={handleViewAll}>
          View all
        </Button>
      </div>

      <ShowIf condition={loading && trendingExperiences.length === 0}>
        <Grid container justifyContent="center">
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </Grid>
      </ShowIf>
    </div>
  );
};

export default TrendingExperienceTab;
