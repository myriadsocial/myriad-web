export type LayoutFilterType = 'people' | 'topic' | 'focus';

export type PrivacyType = 'public' | 'private';
export type PrivacySettingType = 'accountPrivacy' | 'socialMediaPrivacy';
export type NotificationSettingType = 'comments' | 'mentions' | 'friendRequests' | 'tips';
export type LanguageSettingType = 'en' | 'id' | 'ru';

export type PrivacySettings = Record<PrivacySettingType, PrivacyType>;
export type NotificationSettingItems = Record<NotificationSettingType, boolean>;

export type UserSettings = {
  version: string;
  privacy: PrivacySettings;
  notification: NotificationSettingItems;
  language: LanguageSettingType;
};

export enum Privacy {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

export type ResendVerificationEmailPayloadType = {
  email: string;
  callbackURL: string;
};

export type UpdateEmailPayloadType = {
  email: string;
  token: string;
};
