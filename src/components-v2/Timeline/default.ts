import {TimelineSortMethod, TimelineType} from '../../interfaces/timeline';
import {MenuOptions} from '../atoms/DropdownMenu';
import {TabListItem} from '../atoms/TabList';

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

export const experienceFilterOptions: MenuOptions<string>[] = [
  {id: 'all', title: 'All Experience'},
  {id: 'personal', title: 'Personal Experience'},
  {id: 'other', title: 'Other Experience'},
];

// Sort options
export const sortOptions: MenuOptions<TimelineSortMethod>[] = [
  {
    id: 'created',
    title: 'Latest',
  },
  {
    id: 'trending',
    title: 'Popular',
  },
  {
    id: 'like',
    title: 'Most like',
  },
  {
    id: 'comment',
    title: 'Most commented',
  },
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
    id: 'highestAmount',
    title: 'Highest Amount',
  },
  {
    id: 'latestTransaction',
    title: 'Latest Transaction',
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

export const experienceSortOptions: MenuOptions<string>[] = [
  {
    id: 'all',
    title: 'All',
  },
  {
    id: 'aToZ',
    title: 'A-Z',
  },
  {
    id: 'latest',
    title: 'Latest',
  },
];
