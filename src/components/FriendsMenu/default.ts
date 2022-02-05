import {MenuOptions} from '../atoms/DropdownMenu';

export type FriendType = 'all' | 'mutual';
export type SortType = 'oldest' | 'latest';

// Filter options
export const friendFilterOptions: MenuOptions<FriendType>[] = [
  {
    id: 'all',
    title: 'All Friends',
  },
  {
    id: 'mutual',
    title: 'Mutual Friends',
  },
];

export const sortOptions: MenuOptions<SortType>[] = [
  {id: 'latest', title: 'Latest'},
  {id: 'oldest', title: 'Oldest'},
];
