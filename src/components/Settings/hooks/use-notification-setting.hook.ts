import {useState} from 'react';

import {SettingsOption} from './use-setting-list.hook';

import {NotificationSettingType} from 'src/interfaces/setting';
import i18n from 'src/locale';

export type NotificationSetting = Record<NotificationSettingType, boolean>;
export type NotificationSettingsOption = SettingsOption<NotificationSettingType> & {
  enabled: boolean;
};

export const useNotificationSetting = (setting: NotificationSetting) => {
  const [notificationSettings, setNotificationSetting] = useState<NotificationSetting>(setting);

  const settings: NotificationSettingsOption[] = [
    {
      id: 'comments',
      title: i18n.t('Setting.List_Menu.Notification_Setting.Comments'),
      enabled: notificationSettings.comments,
    },
    {
      id: 'mentions',
      title: i18n.t('Setting.List_Menu.Notification_Setting.Mention'),
      enabled: notificationSettings.mentions,
    },
    {
      id: 'friendRequests',
      title: i18n.t('Setting.List_Menu.Notification_Setting.Friend_Requests'),
      enabled: notificationSettings.friendRequests,
    },
    {
      id: 'tips',
      title: i18n.t('Setting.List_Menu.Notification_Setting.Tips'),
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
