import React, {useMemo} from 'react';

import {Experience} from '../../../interfaces/experience';
import {Friend} from '../../../interfaces/friend';
import {Post} from '../../../interfaces/post';
import {SocialMedia} from '../../../interfaces/social';
import {User} from '../../../interfaces/user';
import {FriendListComponent} from '../../FriendsMenu/friend-list';
import {ExperienceTabPanel} from '../../Profile/ExperienceTabPanel/ExperienceTabPanel';
import {Timeline} from '../../Timeline';
import {UserSettings} from '../../UserSettings';
import {UserSocials} from '../../UserSocials';
import {TabItems} from '../../atoms/Tabs';

export type UserMenuTabs = 'post' | 'experience' | 'social' | 'friend' | 'setting';

type UserTabsProps = {
  posts: Post[];
  experiences: Experience[];
  user: User;
  socials: SocialMedia[];
  friends: Friend[];
};

export const useUserTabs = ({
  posts,
  experiences,
  user,
  socials,
  friends,
}: UserTabsProps): TabItems<UserMenuTabs>[] => {
  const tabs: TabItems<UserMenuTabs>[] = useMemo(() => {
    return [
      {
        id: 'post',
        title: `Post`,
        component: <Timeline posts={posts} anonymous={false} filter={false} sort="filter" />,
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
      {
        id: 'setting',
        title: `Public Key`,
        component: <UserSettings user={user} />,
      },
    ];
  }, []);

  return tabs;
};
