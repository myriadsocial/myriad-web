import React from 'react';

import {BlockListContainer} from '../../BlockUserList/BlockList.container';
import {HelpComponent} from '../../Help/Help';
import {AccountSettingsContainer} from '../AccountSettingsContainer';
import {NotificationSettingsContainer} from '../NotificationSettings.container';

export type SettingsType = 'account' | 'notification' | 'block' | 'about' | 'help' | 'version';
export type SettingsOption<T> = {
  id: T;
  title: string;
  subtitle?: string;
  component?: React.ReactNode;
};

export const useSettingList = (): SettingsOption<SettingsType>[] => {
  return [
    {
      id: 'account',
      title: 'Account',
      subtitle: 'Account privacy, social media privacy',
      component: <AccountSettingsContainer />,
    },
    {
      id: 'notification',
      title: 'Notification',
      subtitle: 'Configure any type of notification',
      component: <NotificationSettingsContainer />,
    },
    {
      id: 'block',
      title: 'Blocked User',
      subtitle: 'List of people you blocked on myriad',
      component: <BlockListContainer />,
    },
    {
      id: 'help',
      title: 'Help',
      subtitle: 'Terms and conditions, privacy policy, contact us',
      component: <HelpComponent />,
    },
    {
      id: 'about',
      title: 'About Myriad',
      subtitle: 'Read more about Myriad',
    },
    {
      id: 'version',
      title: 'Myriad version',
    },
  ];
};
