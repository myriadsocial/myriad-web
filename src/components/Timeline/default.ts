import {MenuOptions} from '../atoms/DropdownMenu';

import {ExperienceType} from 'src/interfaces/experience';

// TODO: move this to experience tab
export const experienceFilterOptions: MenuOptions<ExperienceType>[] = [
  {id: 'all', title: 'All Experience'},
  {id: 'personal', title: 'Personal Experience'},
  {id: 'other', title: 'Subscribed Experience'},
];

// TODO: move this to balance detail list
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

// TODO move this to history detail list
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

// TODO move this to history detail list
export const historyCoinSortOptions: MenuOptions<string>[] = [
  {
    id: 'allCoin',
    title: 'All Coins',
  },
];

// TODO move this to history detail list
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
