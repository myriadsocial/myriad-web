import React, {useMemo} from 'react';
import {useSelector} from 'react-redux';

import {RootState} from '../../../reducers';
import {ProfileState} from '../../../reducers/profile/reducer';
import {FriendListContainer} from '../../FriendsMenu/FriendList.container';
import {ExperienceTabPanelContainer} from '../../Profile/ExperienceTabPanel/ExperienceTabPanel.container';
import {PostTabPanel} from '../../Profile/PostTabPanel/PostTabPanel.container';
import {UserSettingsContainer} from '../../UserSettings';
import {UserSocialContainer} from '../../UserSocials';
import {TabItems} from '../../atoms/Tabs';

import {TimelineFilter} from 'src/interfaces/timeline';
import {ExperienceState} from 'src/reducers/experience/reducer';
import {FriendState} from 'src/reducers/friend/reducer';
import {UserState} from 'src/reducers/user/reducer';

export type UserMenuTabs = 'post' | 'experience' | 'social' | 'friend' | 'setting';

export const useUserTabs = (): TabItems<UserMenuTabs>[] => {
  const {detail: profileUser} = useSelector<RootState, ProfileState>(state => state.profileState);
  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const {experiences} = useSelector<RootState, ExperienceState>(state => state.experienceState);
  const {friends} = useSelector<RootState, FriendState>(state => state.friendState);

  const filters: TimelineFilter = {
    owner: profileUser?.id,
  };

  const tabs: TabItems<UserMenuTabs>[] = useMemo(() => {
    const items: TabItems<UserMenuTabs>[] = [
      {
        id: 'post',
        title: `Post`,
        component: <PostTabPanel enableFilter={false} sortType="filter" filters={filters} />,
      },
      {
        id: 'experience',
        title: `Experience`,
        component: <ExperienceTabPanelContainer user={profileUser} />,
      },
      {
        id: 'friend',
        title: `Friends`,
        component: <FriendListContainer user={profileUser} />,
      },
      {
        id: 'social',
        title: `Social Media`,
        component: <UserSocialContainer user={profileUser} />,
        background: 'white',
      },
    ];

    if (user) {
      items.push({
        id: 'setting',
        title: `Public Key`,
        component: <UserSettingsContainer user={user} />,
        background: 'white',
      });
    }

    return items;
  }, [profileUser, user, experiences, friends]);

  return tabs;
};
