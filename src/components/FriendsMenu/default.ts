import {MenuOptions} from '../atoms/DropdownMenu';

import {SortType} from 'src/lib/api/interfaces/pagination-params.interface';

export type FriendType = 'all' | 'mutual';

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
  {id: 'DESC', title: 'Latest'},
  {id: 'ASC', title: 'Oldest'},
];
