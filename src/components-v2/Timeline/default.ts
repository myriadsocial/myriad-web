import {MenuOptions} from '../atoms/DropdownMenu';
import {TabListItem} from '../atoms/TabList';

// Filter options
export const postFilterOptions: MenuOptions[] = [
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

export const experienceFilterOptions: MenuOptions[] = [
  {id: 'all', title: 'All Experience'},
  {id: 'personal', title: 'Personal Experience'},
  {id: 'other', title: 'Other Experience'},
];
// Sort options
export const sortOptions: MenuOptions[] = [
  {
    id: 'latest',
    title: 'Latest',
  },
  {
    id: 'popular',
    title: 'Popular',
  },
  {
    id: 'likes',
    title: 'Most like',
  },
  {
    id: 'comments',
    title: 'Most commented',
  },
];

export const balanceSortOptions: MenuOptions[] = [
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

export const historyAmountSortOptions: MenuOptions[] = [
  {
    id: 'highestAmount',
    title: 'Highest Amount',
  },
  {
    id: 'latestTransaction',
    title: 'Latest Transaction',
  },
];

export const historyCoinSortOptions: MenuOptions[] = [
  {
    id: 'allCoin',
    title: 'All Coins',
  },
];

export const historyTransactionSortOptions: MenuOptions[] = [
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

export const filterOptions: TabListItem<string>[] = [
  {
    id: 'all',
    title: 'All',
  },
  {
    id: 'friend',
    title: 'Friend',
  },
  {
    id: 'trending',
    title: 'Trending',
  },
  {
    id: 'expreience',
    title: 'Experience',
  },
];
