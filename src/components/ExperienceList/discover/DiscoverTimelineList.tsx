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
import { DiscoverTimelineInterface } from 'src/interfaces/experience';
import { AdvanceFilter } from 'src/interfaces/timeline';
import i18n from 'src/locale';

export const DiscoverTimelineList: React.FC = () => {
  const styles = useStyles();
  const defaultFilter = {
    allowedTags: [],
    prohibitedTags: [],
    people: [],
  };
  const [order, setOrder] = useState<string>('subscribedCount DESC');
  const [filter, setFilter] =
    useState<DiscoverTimelineInterface>(defaultFilter);
  const {
    loading,
    page,
    hasMore,
    advanceSearchExperience,
    clearAdvancesExperience,
  } = useExperienceHook();
  const { advanceFilter } = useFilterOption();

  const handleLoadNextPage = () => {
    advanceSearchExperience({ ...filter, order }, page, true);
  };

  React.useEffect(() => {
    advanceSearchExperience({ ...filter, order }, 1, false);
  }, [order]);

  const handleOrder = order => {
    switch (order) {
      case AdvanceFilter.FOLLOWED:
        setOrder('subscribedCount DESC');
        break;
      case AdvanceFilter.NAME_ASC:
        setOrder('name ASC');
        break;
      case AdvanceFilter.NAME_DESC:
        setOrder('name DESC');
        break;
      case AdvanceFilter.DATE_ASC:
        setOrder('createdAt ASC');
        break;
      case AdvanceFilter.DATE_DESC:
        setOrder('createdAt DESC');
        break;
    }
  };

  const handleSearch = async experience => {
    await clearAdvancesExperience();
    setFilter(experience);
    advanceSearchExperience({ ...experience, order }, 1, false);
  };

  return (
    <div className={styles.box}>
      <div className={styles.formSearch}>
        <FormSearch handleSearch={handleSearch} />
      </div>

      <div className={styles.flex}>
        <DropdownMenu<AdvanceFilter>
          title={i18n.t('Post_Sorting.Title_Sort')}
          selected={AdvanceFilter.FOLLOWED}
          options={advanceFilter}
          onChange={handleOrder}
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
