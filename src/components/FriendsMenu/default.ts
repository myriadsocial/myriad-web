import {MenuOptions} from '../atoms/DropdownMenu';

import {SortType} from 'src/lib/api/interfaces/pagination-params.interface';
import i18n from 'src/locale';

export type FriendType = 'all' | 'mutual';

// Filter options
export const friendFilterOptions: MenuOptions<FriendType>[] = [
  {
    id: 'all',
    title: i18n.t('Friends.Filter.All'),
  },
  {
    id: 'mutual',
    title: i18n.t('Friends.Filter.Mutual'),
  },
];

export const sortOptions: MenuOptions<SortType>[] = [
  {id: 'DESC', title: i18n.t('Friends.Sort.Latest')},
  {id: 'ASC', title: i18n.t('Friends.Sort.Oldest')},
];
