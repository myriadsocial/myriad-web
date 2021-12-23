import {useSelector} from 'react-redux';

import {MenuOptions} from 'src/components/atoms/DropdownMenu';
import {TabListItem} from 'src/components/atoms/TabList';
import {TimelineSortMethod, TimelineType} from 'src/interfaces/timeline';
import {RootState} from 'src/reducers';
import {ProfileState} from 'src/reducers/profile/reducer';
import {UserState} from 'src/reducers/user/reducer';

export type ExperienceType = 'all' | 'personal' | 'other';

export const useFilterOption = () => {
  const {user, anonymous} = useSelector<RootState, UserState>(state => state.userState);
  const {detail: people} = useSelector<RootState, ProfileState>(state => state.profileState);

  // Filter options
  const postFilterOptions: MenuOptions<string>[] = [
    {
      id: 'all',
      title: 'All Posts',
    },
    {
      id: 'myriad',
      title: !anonymous && people?.id == user?.id ? 'Myriad Posts' : `${people?.name} Post`,
    },
    {
      id: 'imported',
      title: 'Imported Posts',
    },
  ];

  // Sort options
  const sortOptions: MenuOptions<TimelineSortMethod>[] = [
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

  const filterOptions: TabListItem<TimelineType>[] = [
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

  return {
    postFilterOptions,
    sortOptions,
    filterOptions,
  };
};
