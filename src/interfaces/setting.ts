export type LayoutFilterType = 'people' | 'topic' | 'focus';

export type PrivacyType = 'public' | 'private';
export type PrivacySettingType = 'account' | 'social';
export type NotificationSettingType = 'comment' | 'mention' | 'friend' | 'tip';

export type PrivacySettings = Record<PrivacySettingType, PrivacyType>;
export type NotificationSettingItems = Record<NotificationSettingType, boolean>;

export type UserSettings = {
  version: string;
  privacy: PrivacySettings;
  notification: NotificationSettingItems;
};
