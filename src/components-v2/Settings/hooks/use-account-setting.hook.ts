import {SettingsOption} from './use-setting-list.hook';

import {PrivacySettingType} from 'src/interfaces/setting';

export const useAccountSetting = (): SettingsOption<PrivacySettingType>[] => {
  return [
    {
      id: 'accountPrivacy',
      title: 'Account privacy',
      subtitle: 'Change whether people other than friends can see your posts',
    },
    {
      id: 'socialMediaPrivacy',
      title: 'Social media privacy',
      subtitle: 'Change whether people other than friends can see your social media',
    },
  ];
};
