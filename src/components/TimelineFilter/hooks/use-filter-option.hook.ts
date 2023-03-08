import { useSelector } from 'react-redux';

import { MenuOptions } from 'src/components/atoms/DropdownMenu';
import { TabListItem } from 'src/components/atoms/TabList';
import {
  TimelineOrderType,
  TimelineType,
  PostOriginType,
  TimelineFilterCreated,
} from 'src/interfaces/timeline';
import { SortType } from 'src/lib/api/interfaces/pagination-params.interface';
import i18n from 'src/locale';
import { RootState } from 'src/reducers';
import { ProfileState } from 'src/reducers/profile/reducer';
import { UserState } from 'src/reducers/user/reducer';

export const useFilterOption = () => {
  const { user, anonymous } = useSelector<RootState, UserState>(
    state => state.userState,
  );
  const { detail: people } = useSelector<RootState, ProfileState>(
    state => state.profileState,
  );

  // Filter options
  const originFilterOptions: MenuOptions<PostOriginType>[] = [
    {
      id: 'all',
      title: i18n.t('Post_Sorting.Origin_Filter.All'),
    },
    {
      id: 'myriad',
      title:
        !anonymous && people?.id == user?.id
          ? i18n.t('Post_Sorting.Origin_Filter.Myriad', { name: 'Myriad' })
          : i18n.t('Post_Sorting.Origin_Filter.Myriad', { name: people?.name }),
    },
    {
      id: 'imported',
      title: i18n.t('Post_Sorting.Origin_Filter.Imported'),
    },
  ];

  const typeFilterOptions: TabListItem<TimelineType>[] = [
    {
      id: TimelineType.ALL,
      title: i18n.t('Experience.New.AllOfMyriad'),
    },
  ];

  const orderOptions: MenuOptions<TimelineOrderType>[] = [
    {
      id: TimelineOrderType.LATEST,
      title: i18n.t('Post_Sorting.Order.Latest'),
    },
    {
      id: TimelineOrderType.POPULAR,
      title: i18n.t('Post_Sorting.Order.Popular'),
    },
    {
      id: TimelineOrderType.UPVOTE,
      title: i18n.t('Post_Sorting.Order.Liked'),
    },
    {
      id: TimelineOrderType.COMMENT,
      title: i18n.t('Post_Sorting.Order.Comment'),
    },
    {
      id: TimelineOrderType.TIP,
      title: i18n.t('Post_Sorting.Order.Tip'),
    },
  ];

  const sortOptions: MenuOptions<SortType>[] = [
    { id: 'DESC', title: i18n.t('Post_Sorting.Sort.Latest') },
    { id: 'ASC', title: i18n.t('Post_Sorting.Sort.Oldest') },
  ];

  const createdFilter: MenuOptions<TimelineFilterCreated>[] = [
    {
      id: TimelineFilterCreated.ME,
      title: i18n.t('Experience.Filter.CreatedByMe'),
    },
    {
      id: TimelineFilterCreated.OTHERS,
      title: i18n.t('Experience.Filter.CreatedByOthers'),
    },
  ];

  return {
    originFilterOptions,
    typeFilterOptions,
    orderOptions,
    sortOptions,
    createdFilter,
  };
};
