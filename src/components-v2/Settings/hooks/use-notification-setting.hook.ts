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
      id: 'comment',
      title: 'Comments',
      enabled: notificationSettings.comment,
    },
    {
      id: 'mention',
      title: 'Mention',
      enabled: notificationSettings.mention,
    },
    {
      id: 'friend',
      title: 'Friend Request',
      enabled: notificationSettings.friend,
    },
    {
      id: 'tip',
      title: 'Tips',
      enabled: notificationSettings.tip,
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
  };
};
