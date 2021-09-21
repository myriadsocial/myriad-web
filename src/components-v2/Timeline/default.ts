import {MenuOptions} from '../atoms/DropdownMenu';
import {TabListItem} from '../atoms/TabList';

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
];

export const historyAmountSortOptions: MenuOptions[] = [
  {
    id: 'highestAmount',
    title: 'Highest Amount',
  },
];

export const historyCoinSortOptions: MenuOptions[] = [
  {
    id: 'allCoin',
    title: 'All Coins',
  },
  {
    id: 'aToZ',
    title: 'A-Z',
  },
];

export const historyTransactionSortOptions: MenuOptions[] = [
  {
    id: 'all',
    title: 'All',
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
