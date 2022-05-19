import {MenuOptions} from '../atoms/DropdownMenu';

import {LanguageSettingType, PrivacyType} from 'src/interfaces/setting';
import i18n from 'src/locale';

export const accountPrivacyOptions: MenuOptions<PrivacyType>[] = [
  {
    id: 'private',
    title: i18n.t('Setting.List_Menu.Account_Setting.Options.Private'),
  },
  {
    id: 'public',
    title: i18n.t('Setting.List_Menu.Account_Setting.Options.Public'),
  },
];

export const settingLanguageOptions: MenuOptions<LanguageSettingType>[] = [
  {
    id: 'en',
    title: 'English',
  },
  {
    id: 'id',
    title: 'Bahasa Indonesia',
  },
];
