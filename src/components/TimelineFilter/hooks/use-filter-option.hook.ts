import {useSelector} from 'react-redux';

import {MenuOptions} from 'src/components/atoms/DropdownMenu';
import {TabListItem} from 'src/components/atoms/TabList';
import {TimelineOrderType, TimelineType, PostOriginType} from 'src/interfaces/timeline';
import {SortType} from 'src/lib/api/interfaces/pagination-params.interface';
import {RootState} from 'src/reducers';
import {ProfileState} from 'src/reducers/profile/reducer';
import {UserState} from 'src/reducers/user/reducer';

export const useFilterOption = () => {
  const {user, anonymous} = useSelector<RootState, UserState>(state => state.userState);
  const {detail: people} = useSelector<RootState, ProfileState>(state => state.profileState);

  // Filter options
  const originFilterOptions: MenuOptions<PostOriginType>[] = [
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

  const typeFilterOptions: TabListItem<TimelineType>[] = [
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

  const orderOptions: MenuOptions<TimelineOrderType>[] = [
    {
      id: TimelineOrderType.LATEST,
      title: 'Latest',
    },
    {
      id: TimelineOrderType.POPULAR,
      title: 'Popularity',
    },
    {
      id: TimelineOrderType.UPVOTE,
      title: 'Most liked',
    },
    {
      id: TimelineOrderType.COMMENT,
      title: 'Most commented',
    },
    {
      id: TimelineOrderType.TIP,
      title: 'Most Tipped',
    },
  ];

  const sortOptions: MenuOptions<SortType>[] = [
    {id: 'DESC', title: 'Latest'},
    {id: 'ASC', title: 'Oldest'},
  ];

  return {
    originFilterOptions,
    typeFilterOptions,
    orderOptions,
    sortOptions,
  };
};
