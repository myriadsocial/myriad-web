import React, { useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

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
import { User } from 'src/interfaces/user';
import { ListMeta } from 'src/lib/api/interfaces/base-list.interface';
import i18n from 'src/locale';
import { RootState } from 'src/reducers';

export const TrendingExperienceTab: React.FC = () => {
  const styles = useStyles();
  const [type, setType] = useState<TimelineFilterCreated>();
  const { loadTrendingExperience, loading, clearTrendingExperience } =
    useExperienceHook();
  const { createdFilter } = useFilterOption();

  const trendingExperiences = useSelector<RootState, Experience[]>(
    state => state.experienceState.trendingExperiences,
    shallowEqual,
  );

  const user = useSelector<RootState, User | undefined>(
    state => state.userState.user,
    shallowEqual,
  );

  const trendingExperiencesMeta = useSelector<RootState, ListMeta>(
    state => state.experienceState.meta,
    shallowEqual,
  );

  React.useEffect(() => {
    loadTrendingExperience(1);
  }, []);

  const handleLoadNextPage = () => {
    const createdBy =
      type === TimelineFilterCreated.ME
        ? `createdBy=${user.id}`
        : `createdBy[neq]=${user.id}`;
    if (type)
      loadTrendingExperience(trendingExperiencesMeta.nextPage, createdBy);
    else loadTrendingExperience(trendingExperiencesMeta.nextPage);
  };

  const handleFilter = async (filter: TimelineFilterCreated) => {
    await clearTrendingExperience();
    setType(filter);
    const createdBy =
      filter === TimelineFilterCreated.ME
        ? `createdBy=${user.id}`
        : `createdBy[neq]=${user.id}`;
    loadTrendingExperience(1, createdBy);
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
          onChange={handleFilter}
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
        hasMore={
          Boolean(user)
            ? trendingExperiencesMeta.currentPage <
              trendingExperiencesMeta.totalPageCount
            : false
        }
        loadNextPage={handleLoadNextPage}
      />

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
