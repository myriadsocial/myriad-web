import React, {useMemo} from 'react';
import {shallowEqual, useSelector} from 'react-redux';

import {CommentHistoryListContainer} from 'src/components/CommentHistoryList';
import {FriendListContainer} from 'src/components/FriendsMenu/FriendList.container';
import {ProfileExperienceTab} from 'src/components/Profile/tabs/ExperienceTab';
import {ProfilePostsTab} from 'src/components/Profile/tabs/PostTabs';
import {UserSettingsContainer} from 'src/components/UserSettings';
import {UserSocialContainer} from 'src/components/UserSocials';
import {TabItems} from 'src/components/atoms/Tabs';
import {TimelineFilterFields} from 'src/interfaces/timeline';
import {FriendStatusProps, User} from 'src/interfaces/user';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';

export type UserMenuTabs = 'post' | 'comments' | 'experience' | 'social' | 'friend' | 'setting';

export const useUserTabs = (excludes: UserMenuTabs[]): TabItems<UserMenuTabs>[] => {
  const profile = useSelector<RootState, User & FriendStatusProps>(
    state => state.profileState.detail,
    shallowEqual,
  );
  const user = useSelector<RootState, User>(state => state.userState.user, shallowEqual);
  const isOwnProfile = profile?.id === user?.id;
  const filtersFields: TimelineFilterFields = {
    owner: profile?.id,
  };

  const tabs: TabItems<UserMenuTabs>[] = useMemo(() => {
    const items: TabItems<UserMenuTabs>[] = [
      {
        id: 'post',
        title: i18n.t('Profile.Tab.Post'),
        component: (
          <ProfilePostsTab
            user={user}
            filterType="origin"
            sortType="created"
            filters={filtersFields}
          />
        ),
      },
      {
        id: 'comments',
        title: i18n.t('Profile.Tab.Comments'),
        component: <CommentHistoryListContainer profile={profile} />,
      },
      {
        id: 'experience',
        title: i18n.t('Profile.Tab.Experience'),
        component: <ProfileExperienceTab user={profile} type="personal" />,
      },
      {
        id: 'friend',
        title: i18n.t('Profile.Tab.Friends'),
        component: (
          <FriendListContainer
            type="contained"
            user={profile}
            disableFilter={isOwnProfile}
            isProfile
          />
        ),
      },
      {
        id: 'social',
        title: i18n.t('Profile.Tab.Social_Media'),
        component: <UserSocialContainer user={profile} />,
        background: 'white',
      },
    ];

    if (user && !excludes.includes('setting')) {
      items.push({
        id: 'setting',
        title: i18n.t('Profile.Tab.Wallet_Address'),
        component: <UserSettingsContainer user={profile} />,
        background: 'white',
      });
    }

    return items;
  }, [profile, user]);

  return tabs;
};
