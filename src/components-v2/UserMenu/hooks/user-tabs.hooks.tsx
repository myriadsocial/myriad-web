import React, {useMemo} from 'react';
import {useSelector} from 'react-redux';

import {Experience} from '../../../interfaces/experience';
import {Friend} from '../../../interfaces/friend';
import {SocialMedia} from '../../../interfaces/social';
import {User} from '../../../interfaces/user';
import {RootState} from '../../../reducers';
import {ProfileState} from '../../../reducers/profile/reducer';
import {FriendListComponent} from '../../FriendsMenu/friend-list';
import {ExperienceTabPanel} from '../../Profile/ExperienceTabPanel/ExperienceTabPanel';
import {TimelineContainer} from '../../Timeline';
import {UserSettings} from '../../UserSettings';
import {UserSocials} from '../../UserSocials';
import {TabItems} from '../../atoms/Tabs';

import {TimelineFilter} from 'src/interfaces/timeline';

export type UserMenuTabs = 'post' | 'experience' | 'social' | 'friend' | 'setting';

type UserTabsProps = {
  experiences: Experience[];
  user?: User;
  socials: SocialMedia[];
  friends: Friend[];
};

export const useUserTabs = (props: UserTabsProps): TabItems<UserMenuTabs>[] => {
  const {experiences, user, socials, friends} = props;
  const {detail: people} = useSelector<RootState, ProfileState>(state => state.profileState);
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
