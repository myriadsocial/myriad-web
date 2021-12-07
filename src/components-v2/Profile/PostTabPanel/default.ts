import {MenuOptions} from '../../atoms/DropdownMenu';

export type SortType = 'oldest' | 'latest';

export const sortOptions: MenuOptions<SortType>[] = [
  {id: 'latest', title: 'Latest'},
  {id: 'oldest', title: 'Oldest'},
];
