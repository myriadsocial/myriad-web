import MyriadAPI from './base';

import {NotificationSettingItems} from 'src/interfaces/setting';

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
