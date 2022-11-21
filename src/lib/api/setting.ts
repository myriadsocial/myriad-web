import MyriadAPI from './base';

import {
  NotificationSettingItems,
  PrivacySettings,
  ResendVerificationEmailPayloadType,
  UpdateEmailPayloadType,
} from 'src/interfaces/setting';

export const updateAccountSettings = async (
  userId: string,
  settings: Partial<PrivacySettings>,
): Promise<PrivacySettings> => {
  const {data} = await MyriadAPI().request<PrivacySettings>({
    url: `/user/account-setting`,
    method: 'PATCH',
    data: settings,
  });
  return data;
};

export const getAccountSettings = async (userId: string): Promise<PrivacySettings> => {
  const {data} = await MyriadAPI().request<PrivacySettings>({
    url: `/user/account-setting`,
    method: 'GET',
  });

  return data;
};

export const updateNotificationSettings = async (
  userId: string,
  settings: NotificationSettingItems,
): Promise<NotificationSettingItems> => {
  const {data} = await MyriadAPI().request<NotificationSettingItems>({
    url: `/user/notification-setting`,
    method: 'PATCH',
    data: settings,
  });
  return data;
};

export const getNotificationSettings = async (
  userId: string,
): Promise<NotificationSettingItems> => {
  const {data} = await MyriadAPI().request<NotificationSettingItems>({
    url: `/user/notification-setting`,
    method: 'GET',
  });

  return data;
};

export const sendVerificationEmailServices = async (
  payload: ResendVerificationEmailPayloadType,
): Promise<ResendVerificationEmailPayloadType> => {
  const {data} = await MyriadAPI().request<ResendVerificationEmailPayloadType>({
    url: `/user/otp/email`,
    method: 'POST',
    data: payload,
  });

  return data;
};

export const updateEmail = async (token: string): Promise<UpdateEmailPayloadType> => {
  const {data} = await MyriadAPI().request<UpdateEmailPayloadType>({
    url: `/user/email-setting?token=${token}`,
    method: 'PATCH',
  });
  return data;
};

export const deleteEmail = async (token: string): Promise<string> => {
  const {data} = await MyriadAPI().request<string>({
    url: `/user/email-setting?token=${token}`,
    method: 'DELETE',
  });
  return data;
};
