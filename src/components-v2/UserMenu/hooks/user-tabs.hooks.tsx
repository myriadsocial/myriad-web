import React, {useMemo} from 'react';
import {useSelector} from 'react-redux';

import {RootState} from '../../../reducers';
import {ProfileState} from '../../../reducers/profile/reducer';
import {FriendListContainer} from '../../FriendsMenu/FriendList.container';
import {ExperienceTabPanelContainer} from '../../Profile/ExperienceTabPanel/ExperienceTabPanel.container';
import {TimelineContainer} from '../../Timeline';
import {UserSettingsContainer} from '../../UserSettings';
import {UserSocialContainer} from '../../UserSocials';
import {TabItems} from '../../atoms/Tabs';

import {TimelineFilter} from 'src/interfaces/timeline';
import {UserState} from 'src/reducers/user/reducer';

export type UserMenuTabs = 'post' | 'experience' | 'social' | 'friend' | 'setting';

export const useUserTabs = (): TabItems<UserMenuTabs>[] => {
  const {detail: people} = useSelector<RootState, ProfileState>(state => state.profileState);
  const {user} = useSelector<RootState, UserState>(state => state.userState);

  const filters: TimelineFilter = {
    owner: people?.id,
  };

  const tabs: TabItems<UserMenuTabs>[] = useMemo(() => {
    const items: TabItems<UserMenuTabs>[] = [
      {
        id: 'post',
        title: `Post`,
        component: <TimelineContainer enableFilter={false} sortType="filter" filters={filters} />,
      },
      {
        id: 'experience',
        title: `Experience`,
        component: <ExperienceTabPanelContainer />,
      },
      {
        id: 'friend',
        title: `Friends`,
        component: <FriendListContainer user={people} />,
      },
      {
        id: 'social',
        title: `Social Media`,
        component: <UserSocialContainer user={people} />,
      },
    ];

    if (user) {
      items.push({
        id: 'setting',
        title: `Public Key`,
        component: <UserSettingsContainer user={user} />,
      });
    }

    return items;
  }, [people, user]);

  return tabs;
};
