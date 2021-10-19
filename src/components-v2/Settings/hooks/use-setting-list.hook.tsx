import React from 'react';

import {BlockListContainer} from '../../BlockUserList/BlockList.container';
import {HelpComponent} from '../../Help/Help';

export type SettingsOption = {
  id: string;
  title: string;
  subtitle?: string;
  component?: React.ReactNode;
};

export const useSettingList = (): SettingsOption[] => {
  return [
    {
      id: 'account',
      title: 'Account',
      subtitle: 'account privacy, social media privacy',
      component: <p>Test</p>,
    },
    {
      id: 'notification',
      title: 'Notification',
      subtitle:
        'By blocking someone, they can no longer see things you post on your timeline, tag you, and start a conversation with you, or add you as a friend.',
      component: <p>Test</p>,
    },
    {
      id: 'block',
      title: 'Blocked User',
      subtitle: 'list of people you blocked on myriad',
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
