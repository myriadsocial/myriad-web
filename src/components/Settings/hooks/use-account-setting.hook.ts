import {SettingsOption} from './use-setting-list.hook';

import {PrivacySettingType} from 'src/interfaces/setting';
import i18n from 'src/locale';

export const useAccountSetting = (): SettingsOption<PrivacySettingType>[] => {
  return [
    {
      id: 'accountPrivacy',
      title: i18n.t('Setting.List_Menu.Account_Setting.Account_Privacy.Title'),
      subtitle: i18n.t('Setting.List_Menu.Account_Setting.Account_Privacy.Subtitle'),
    },
    {
      id: 'socialMediaPrivacy',
      title: i18n.t('Setting.List_Menu.Account_Setting.Social_Media_Privacy.Title'),
      subtitle: i18n.t('Setting.List_Menu.Account_Setting.Social_Media_Privacy.Subtitle'),
    },
  ];
};
