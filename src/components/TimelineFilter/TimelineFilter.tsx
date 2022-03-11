import React from 'react';

import {Grid} from '@material-ui/core';

import {DropdownMenu} from '../atoms/DropdownMenu';
import {TabList} from '../atoms/TabList';
import ShowIf from '../common/show-if.component';
import {useStyles} from './TimelineFilter.styles';
import {useFilterOption} from './hooks/use-filter-option.hook';

import {TimelineType, TimelineOrderType} from 'src/interfaces/timeline';
import {User} from 'src/interfaces/user';
import {SortType} from 'src/lib/api/interfaces/pagination-params.interface';

export type TimelineFilterProps = {
  user?: User;
  filterType?: 'origin' | 'type';
  selectionType?: 'order' | 'sort';
  type: TimelineType;
  order: TimelineOrderType;
  sortTimeline: (sort: SortType) => void;
  orderTimeline: (order: TimelineOrderType) => void;
  filterTimeline?: (type: TimelineType) => void;
  filterOrigin?: (origin: string) => void;
};

export const TimelineFilter: React.FC<TimelineFilterProps> = props => {
  const {
    type,
    order,
    filterType,
    selectionType,
    sortTimeline,
    orderTimeline,
    filterTimeline,
    filterOrigin,
  } = props;
  const styles = useStyles({...props, filterType});

  const {sortOptions, orderOptions, originFilterOptions, typeFilterOptions} = useFilterOption();

  const handleSort = (sort: string) => {
    sortTimeline(sort as SortType);
  };

  const handleOrder = (order: string) => {
    orderTimeline(order as TimelineOrderType);
  };

  const handleFilter = (variant: string) => {
    filterTimeline && filterTimeline(variant as TimelineType);
  };

  const handleFilterOrigin = (origin: string) => {
    filterOrigin && filterOrigin(origin);
  };

  return (
    <Grid container alignItems="center" className={styles.root}>
      <ShowIf condition={filterType === 'type'}>
        <TabList
          tabs={typeFilterOptions}
          active={type}
          mark="underline"
          size="small"
          position="left"
          onChangeTab={handleFilter}
        />
      </ShowIf>

      <ShowIf condition={filterType === 'origin'}>
        <div className={styles.mobile}>
          <DropdownMenu
            title="Filter by"
            selected={type}
            options={originFilterOptions}
            onChange={handleFilterOrigin}
          />
        </div>
      </ShowIf>

      <ShowIf condition={selectionType === 'order'}>
        <DropdownMenu
          title="Sort by"
          selected={order}
          options={orderOptions}
          onChange={handleOrder}
        />
      </ShowIf>

      <ShowIf condition={selectionType === 'sort'}>
        <DropdownMenu title="Sort by" options={sortOptions} onChange={handleSort} />
      </ShowIf>
    </Grid>
  );
};
