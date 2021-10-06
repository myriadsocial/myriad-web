import React from 'react';

import ShowIf from '../../components/common/show-if.component';
import {DropdownMenu} from '../atoms/DropdownMenu';
import {FilterDropdownMenu} from '../atoms/FilterDropdownMenu/';
import {TabList} from '../atoms/TabList';
import {useStyles} from './TimelineFilter.styles';
import {useFilterOption} from './hooks/use-filter-option.hook';

import {TimelineSortMethod, TimelineType} from 'src/interfaces/timeline';
import {User} from 'src/interfaces/user';

type TimelineFilterProps = {
  user?: User;
  enableFilter?: boolean;
  sortType?: 'metric' | 'filter';
  type: TimelineType;
  sort: TimelineSortMethod;
  sortTimeline: (sort: TimelineSortMethod) => void;
  filterTimeline?: (type: TimelineType) => void;
  filterOrigin?: (origin: string) => void;
};

export const TimelineFilter: React.FC<TimelineFilterProps> = props => {
  const {
    type,
    sort,
    enableFilter = true,
    sortType = 'metric',
    sortTimeline,
    filterTimeline,
    filterOrigin,
  } = props;
  const styles = useStyles();

  const {filterOptions, sortOptions, postFilterOptions} = useFilterOption();

  const handleSort = (sort: string) => {
    sortTimeline(sort as TimelineSortMethod);
  };

  const handleFilter = (variant: string) => {
    filterTimeline && filterTimeline(variant as TimelineType);
  };

  const handleFilterOrigin = (origin: string) => {
    filterOrigin && filterOrigin(origin);
  };

  return (
    <div className={styles.root}>
      {enableFilter && (
        <TabList
          tabs={filterOptions}
          active={type}
          mark="underline"
          size="small"
          position="left"
          onChangeTab={handleFilter}
          className={styles.filter}
        />
      )}

      <ShowIf condition={sortType == 'metric'}>
        <DropdownMenu title="Sort by" selected={sort} options={sortOptions} onChange={handleSort} />
      </ShowIf>

      <ShowIf condition={sortType == 'filter'}>
        <FilterDropdownMenu
          title="Filter by"
          selected={type}
          options={postFilterOptions}
          onChange={handleFilterOrigin}
        />
      </ShowIf>
    </div>
  );
};
