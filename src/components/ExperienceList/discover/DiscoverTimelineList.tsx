import React, { useState } from 'react';

import Grid from '@material-ui/core/Grid';

import { Skeleton } from '../../Expericence';
import { ExperienceListContainer } from '../ExperienceList.container';
import { FormSearch } from './FormSearch';
import { useStyles } from './Tab.style';

import { useFilterOption } from 'components/TimelineFilter/hooks/use-filter-option.hook';
import { DropdownMenu } from 'components/atoms/DropdownMenu';
import ShowIf from 'src/components/common/show-if.component';
import {
  ExperienceOwner,
  useExperienceHook,
} from 'src/hooks/use-experience-hook';
import { TimelineOrderType } from 'src/interfaces/timeline';
import i18n from 'src/locale';

export const DiscoverTimelineList: React.FC = () => {
  const styles = useStyles();
  const [allowedTags, setAllowedTags] = useState<string[]>([]);
  const [prohibitedTags, setProhibitedTags] = useState<string[]>([]);
  const [people, setPeople] = useState<string[]>([]);
  const {
    loading,
    page,
    hasMore,
    advanceSearchExperience,
    clearAdvancesExperience,
  } = useExperienceHook();
  const { orderOptions } = useFilterOption();

  const handleLoadNextPage = () => {
    advanceSearchExperience(allowedTags, prohibitedTags, people, page, true);
  };

  React.useEffect(() => {
    advanceSearchExperience(allowedTags, prohibitedTags, people, page, false);
  }, []);

  const handleSearch = async experience => {
    await clearAdvancesExperience();
    setAllowedTags(experience.allowedTags);
    setProhibitedTags(experience.prohibitedTags);
    setPeople(experience.people);
    advanceSearchExperience(
      experience.allowedTags,
      experience.prohibitedTags,
      experience.people,
      1,
      false,
    );
  };

  return (
    <div className={styles.box}>
      <div className={styles.formSearch}>
        <FormSearch handleSearch={handleSearch} />
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
        owner={ExperienceOwner.DISCOVER}
        selectable={false}
        enableClone
        enableSubscribe
        filterTimeline
        hasMore={hasMore}
        loadNextPage={() => handleLoadNextPage()}
        discover
      />

      <ShowIf condition={loading}>
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
