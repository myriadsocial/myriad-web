import React from 'react';

export type SettingsOption = {
  id: string;
  title: string;
  subtitle: string;
  component: React.ReactNode;
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
      id: 'post',
      title: 'Post',
      subtitle: 'who can see your post, comment, send tip etc',
      component: <p>Test</p>,
    },
    {
      id: 'notification',
      title: 'Notification',
      subtitle: 'configure any type of notification',
      component: <p>Test</p>,
    },
    {
      id: 'block',
      title: 'Blocked User',
      subtitle: 'list of people you blocked on myriad',
      component: <p>Test</p>,
    },
    {
      id: 'help',
      title: 'Help',
      subtitle: 'Terms and conditions, privacy policy, contact us',
      component: <p>Test</p>,
    },
    {
      id: 'about',
      title: 'About Myriad',
      subtitle: 'Read more about Myriad',
      component: <p>Test</p>,
    },
  ];
};
