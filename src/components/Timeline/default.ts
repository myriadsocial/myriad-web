import {MenuOptions} from '../atoms/DropdownMenu';
import {TabListItem} from '../atoms/TabList';

import {ExperienceType} from 'src/interfaces/experience';
import {TimelineSortMethod, TimelineType} from 'src/interfaces/timeline';

export type SortType = 'oldest' | 'latest';

// Filter options
export const postFilterOptions: MenuOptions<string>[] = [
  {
    id: 'all',
    title: 'All Posts',
  },
  {
    id: 'myriad',
    title: 'Myriad Posts',
  },
  {
    id: 'imported',
    title: 'Imported Posts',
  },
];

export const experienceFilterOptions: MenuOptions<ExperienceType>[] = [
  {id: 'all', title: 'All Experience'},
  {id: 'personal', title: 'Personal Experience'},
  {id: 'other', title: 'Subscribed Experience'},
];

// Sort options
export const timelineSortOptions: MenuOptions<TimelineSortMethod>[] = [
  {
    id: 'created',
    title: 'Latest',
  },
  {
    id: 'trending',
    title: 'Popularity',
  },
  {
    id: 'like',
    title: 'Most liked',
  },
  {
    id: 'comment',
    title: 'Most commented',
  },
];

export const postCreatedSortOptions: MenuOptions<SortType>[] = [
  {id: 'latest', title: 'Latest'},
  {id: 'oldest', title: 'Oldest'},
];

export const balanceSortOptions: MenuOptions<string>[] = [
  {
    id: 'all',
    title: 'All',
  },
  {
    id: 'aToZ',
    title: 'A-Z',
  },
  {
    id: 'highest',
    title: 'Highest Asset',
  },
  {
    id: 'lowest',
    title: 'Lowest Asset',
  },
];

export const historyAmountSortOptions: MenuOptions<string>[] = [
  {
    id: 'latestTransaction',
    title: 'Latest Transaction',
  },
  {
    id: 'highestAmount',
    title: 'Highest Amount',
  },
];

export const historyCoinSortOptions: MenuOptions<string>[] = [
  {
    id: 'allCoin',
    title: 'All Coins',
  },
];

export const historyTransactionSortOptions: MenuOptions<string>[] = [
  {
    id: 'all',
    title: 'All',
  },
  {
    id: 'received',
    title: 'Received',
  },
  {
    id: 'sent',
    title: 'Sent',
  },
];

export const filterOptions: TabListItem<TimelineType>[] = [
  {
    id: TimelineType.ALL,
    title: 'All',
  },
  {
    id: TimelineType.FRIEND,
    title: 'Friend',
  },
  {
    id: TimelineType.TRENDING,
    title: 'Trending',
  },
  {
    id: TimelineType.EXPERIENCE,
    title: 'Experience',
  },
];
