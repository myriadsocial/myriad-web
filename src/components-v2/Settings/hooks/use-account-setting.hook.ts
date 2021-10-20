export type SettingsOption = {
  id: string;
  title: string;
  subtitle?: string;
};

export const useAccountSetting = (): SettingsOption[] => {
  return [
    {
      id: 'account-privacy',
      title: 'Account privacy',
      subtitle: 'Change whether people other than friends can see your posts',
    },
    {
      id: 'social-media-privacy',
      title: 'Social media privacy',
      subtitle: 'Change whether people other than friends can see your social media',
    },
  ];
};
