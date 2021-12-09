import MyriadAPI from './base';

import {NotificationSettingItems, PrivacySettings} from 'src/interfaces/setting';

export const updateAccountSettings = async (
  userId: string,
  settings: Partial<PrivacySettings>,
): Promise<PrivacySettings> => {
  const {data} = await MyriadAPI.request<PrivacySettings>({
    url: `/users/${userId}/account-setting`,
    method: 'PATCH',
    data: settings,
  });
  return data;
};

export const getAccountSettings = async (userId: string): Promise<PrivacySettings> => {
  const {data} = await MyriadAPI.request<PrivacySettings>({
    url: `/users/${userId}/account-setting`,
    method: 'GET',
  });

  return data;
};

export const updateNotificationSettings = async (
  userId: string,
  settings: NotificationSettingItems,
): Promise<NotificationSettingItems> => {
  const {data} = await MyriadAPI.request<NotificationSettingItems>({
    url: `/users/${userId}/notification-setting`,
    method: 'PATCH',
    data: settings,
  });
  return data;
};

export const getNotificationSettings = async (
  userId: string,
): Promise<NotificationSettingItems> => {
  const {data} = await MyriadAPI.request<NotificationSettingItems>({
    url: `/users/${userId}/notification-setting`,
    method: 'GET',
  });

  return data;
};
