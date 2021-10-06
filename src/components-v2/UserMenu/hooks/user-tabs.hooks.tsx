import React, {useMemo} from 'react';
import {useSelector} from 'react-redux';

import {RootState} from '../../../reducers';
import {ProfileState} from '../../../reducers/profile/reducer';
import {FriendListContainer} from '../../FriendsMenu/FriendList.container';
import {ExperienceTabPanel} from '../../Profile/ExperienceTabPanel/ExperienceTabPanel';
import {TimelineContainer} from '../../Timeline';
import {UserSettings} from '../../UserSettings';
import {UserSocials} from '../../UserSocials';
import {TabItems} from '../../atoms/Tabs';

import {TimelineFilter} from 'src/interfaces/timeline';
import {ExperienceState} from 'src/reducers/experience/reducer';
import {FriendState} from 'src/reducers/friend/reducer';
import {UserState} from 'src/reducers/user/reducer';

export type UserMenuTabs = 'post' | 'experience' | 'social' | 'friend' | 'setting';

export const useUserTabs = (): TabItems<UserMenuTabs>[] => {
  const {detail: people} = useSelector<RootState, ProfileState>(state => state.profileState);
  const {user, socials} = useSelector<RootState, UserState>(state => state.userState);
  const {friends} = useSelector<RootState, FriendState>(state => state.friendState);
  const {experiences} = useSelector<RootState, ExperienceState>(state => state.experienceState);

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
        component: <ExperienceTabPanel experiences={experiences} />,
      },
      {
        id: 'friend',
        title: `Friends`,
        component: <FriendListContainer user={people} />,
      },
      {
        id: 'social',
        title: `Social Media`,
        component: <UserSocials socials={socials} />,
      },
    ];

    if (user) {
      items.push({
        id: 'setting',
        title: `Public Key`,
        component: <UserSettings user={user} />,
      });
    }

    return items;
  }, [socials, friends, experiences]);

  return tabs;
};
