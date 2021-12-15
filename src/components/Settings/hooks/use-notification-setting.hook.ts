import {useState} from 'react';

import {SettingsOption} from './use-setting-list.hook';

import {NotificationSettingType} from 'src/interfaces/setting';

export type NotificationSetting = Record<NotificationSettingType, boolean>;
export type NotificationSettingsOption = SettingsOption<NotificationSettingType> & {
  enabled: boolean;
};

export const useNotificationSetting = (setting: NotificationSetting) => {
  const [notificationSettings, setNotificationSetting] = useState<NotificationSetting>(setting);

  const settings: NotificationSettingsOption[] = [
    {
      id: 'comments',
      title: 'Comments',
      enabled: notificationSettings.comments,
    },
    {
      id: 'mentions',
      title: 'Mention',
      enabled: notificationSettings.mentions,
    },
    {
      id: 'friendRequests',
      title: 'Friend Request',
      enabled: notificationSettings.friendRequests,
    },
    {
      id: 'tips',
      title: 'Tips',
      enabled: notificationSettings.tips,
    },
  ];

  const changeSetting = (type: NotificationSettingType, enabled: boolean) => {
    setNotificationSetting(prevSetting => ({
      ...prevSetting,
      [type]: enabled,
    }));
  };

  return {
    settings,
    settingsProp: notificationSettings,
    changeSetting,
    setNotificationSetting,
  };
};
