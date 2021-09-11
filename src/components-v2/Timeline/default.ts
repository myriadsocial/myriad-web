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
