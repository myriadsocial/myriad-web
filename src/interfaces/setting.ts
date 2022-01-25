export type LayoutFilterType = 'people' | 'topic' | 'focus';

export type PrivacyType = 'public' | 'private';
export type PrivacySettingType = 'accountPrivacy' | 'socialMediaPrivacy';
export type NotificationSettingType = 'comments' | 'mentions' | 'friendRequests' | 'tips';
export type LanguageSettingType = 'en' | 'id';

export type PrivacySettings = Record<PrivacySettingType, PrivacyType>;
export type NotificationSettingItems = Record<NotificationSettingType, boolean>;

export type UserSettings = {
  version: string;
  privacy: PrivacySettings;
  notification: NotificationSettingItems;
  language: LanguageSettingType;
};
