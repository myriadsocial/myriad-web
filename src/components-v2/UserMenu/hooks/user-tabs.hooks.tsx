import React, {useMemo} from 'react';

import {Experience} from '../../../interfaces/experience';
import {Post} from '../../../interfaces/post';
import {SocialMedia} from '../../../interfaces/social';
import {User} from '../../../interfaces/user';
import {ExperienceList} from '../../ExperienceList';
import {FriendListComponent} from '../../FriendsMenu/friend-list';
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
};

export const useUserTabs = ({
  posts,
  experiences,
  user,
  socials,
}: UserTabsProps): TabItems<UserMenuTabs>[] => {
  const tabs: TabItems<UserMenuTabs>[] = useMemo(() => {
    return [
      {
        id: 'post',
        title: `Post`,
        component: <Timeline posts={posts} anonymous={false} allowFilter={false} />,
      },
      {
        id: 'experience',
        title: `Experience`,
        component: <ExperienceList experiences={experiences} />,
      },
      {
        id: 'social',
        title: `Social Media`,
        component: <UserSocials socials={socials} />,
      },
      {
        id: 'friend',
        title: `Friends`,
        component: <FriendListComponent />,
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
