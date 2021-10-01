import React, {useMemo} from 'react';

import {Experience} from '../../../interfaces/experience';
import {Friend} from '../../../interfaces/friend';
import {SocialMedia} from '../../../interfaces/social';
import {User} from '../../../interfaces/user';
import {FriendListComponent} from '../../FriendsMenu/friend-list';
import {ExperienceTabPanel} from '../../Profile/ExperienceTabPanel/ExperienceTabPanel';
import {TimelineContainer} from '../../Timeline';
import {UserSettings} from '../../UserSettings';
import {UserSocials} from '../../UserSocials';
import {TabItems} from '../../atoms/Tabs';

export type UserMenuTabs = 'post' | 'experience' | 'social' | 'friend' | 'setting';

type UserTabsProps = {
  experiences: Experience[];
  user?: User;
  socials: SocialMedia[];
  friends: Friend[];
};

export const useUserTabs = (props: UserTabsProps): TabItems<UserMenuTabs>[] => {
  const {experiences, user, socials, friends} = props;

  const tabs: TabItems<UserMenuTabs>[] = useMemo(() => {
    const items: TabItems<UserMenuTabs>[] = [
      {
        id: 'post',
        title: `Post`,
        component: <TimelineContainer enableFilter={false} sortType="filter" />,
      },
      {
        id: 'experience',
        title: `Experience`,
        component: <ExperienceTabPanel experiences={experiences} />,
      },
      {
        id: 'friend',
        title: `Friends`,
        component: <FriendListComponent friends={friends} />,
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
  }, [props]);

  return tabs;
};
