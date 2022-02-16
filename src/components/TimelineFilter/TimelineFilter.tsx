import React from 'react';

import {Grid} from '@material-ui/core';

import {DropdownMenu} from '../atoms/DropdownMenu';
import {TabList} from '../atoms/TabList';
import ShowIf from '../common/show-if.component';
import {useStyles} from './TimelineFilter.styles';
import {useFilterOption} from './hooks/use-filter-option.hook';

import {TimelineSortMethod, TimelineType, TimelineSortOrder} from 'src/interfaces/timeline';
import {User} from 'src/interfaces/user';

type TimelineFilterProps = {
  user?: User;
  filterType?: 'origin' | 'type';
  sortType?: 'metric' | 'created';
  type: TimelineType;
  sort: TimelineSortMethod;
  sortTimeline: (sort: TimelineSortMethod) => void;
  orderTimeline: (order: TimelineSortOrder) => void;
  filterTimeline?: (type: TimelineType) => void;
  filterOrigin?: (origin: string) => void;
};

export const TimelineFilter: React.FC<TimelineFilterProps> = props => {
  const {
    type,
    sort,
    filterType,
    sortType,
    sortTimeline,
    orderTimeline,
    filterTimeline,
    filterOrigin,
  } = props;
  const styles = useStyles();

  const {orderOptions, metricSortOptions, originFilterOptions, typeFilterOptions} =
    useFilterOption();

  const handleSort = (sort: string) => {
    sortTimeline(sort as TimelineSortMethod);
  };

  const handleOrder = (order: string) => {
    orderTimeline(order as TimelineSortOrder);
  };

  const handleFilter = (variant: string) => {
    filterTimeline && filterTimeline(variant as TimelineType);
  };

  const handleFilterOrigin = (origin: string) => {
    filterOrigin && filterOrigin(origin);
  };

  return (
    <Grid container alignItems="center" justifyContent="space-between">
      <ShowIf condition={filterType === 'type'}>
        <TabList
          tabs={typeFilterOptions}
          active={type}
          mark="underline"
          size="small"
          position="left"
          onChangeTab={handleFilter}
          className={styles.filter}
        />
      </ShowIf>

      <ShowIf condition={filterType === 'origin'}>
        <DropdownMenu
          title="Filter by"
          selected={type}
          options={originFilterOptions}
          onChange={handleFilterOrigin}
        />
      </ShowIf>

      <ShowIf condition={sortType === 'metric'}>
        <DropdownMenu
          title="Sort by"
          selected={sort}
          options={metricSortOptions}
          onChange={handleSort}
        />
      </ShowIf>

      <ShowIf condition={sortType === 'created'}>
        <DropdownMenu title="Sort by" options={orderOptions} onChange={handleOrder} />
      </ShowIf>
    </Grid>
  );
};
