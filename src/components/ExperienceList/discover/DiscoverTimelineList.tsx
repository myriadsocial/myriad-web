import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import Grid from '@material-ui/core/Grid';

import { Skeleton } from '../../Expericence';
import { ExperienceListContainer } from '../ExperienceList.container';
import { FormSearch } from './FormSearch';
import { useStyles } from './Tab.style';

import { useFilterOption } from 'components/TimelineFilter/hooks/use-filter-option.hook';
import { DropdownMenu } from 'components/atoms/DropdownMenu';
import ShowIf from 'src/components/common/show-if.component';
import { useExperienceHook } from 'src/hooks/use-experience-hook';
import { Experience } from 'src/interfaces/experience';
import { TimelineOrderType } from 'src/interfaces/timeline';
import i18n from 'src/locale';
import { RootState } from 'src/reducers';

export const DiscoverTimelineList: React.FC = () => {
  const styles = useStyles();
  const { loading, searchExperience, page, hasMore } = useExperienceHook();
  const { orderOptions } = useFilterOption();

  const handleLoadNextPage = () => {
    searchExperience('', page + 1);
  };

  const trendingExperiences = useSelector<RootState, Experience[]>(
    state => state.experienceState.trendingExperiences,
    shallowEqual,
  );

  React.useEffect(() => {
    // loadTrendingExperience();
    searchExperience('', page);
  }, []);

  return (
    <div className={styles.box}>
      <div className={styles.formSearch}>
        <FormSearch />
      </div>

      <div className={styles.flex}>
        <DropdownMenu<TimelineOrderType>
          title={i18n.t('Post_Sorting.Title_Sort')}
          selected={TimelineOrderType.LATEST}
          options={orderOptions}
          onChange={() => null}
        />
      </div>
      <ExperienceListContainer
        selectable={false}
        enableClone
        enableSubscribe
        filterTimeline
        hasMore={hasMore}
        loadNextPage={() => handleLoadNextPage()}
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

export default DiscoverTimelineList;
