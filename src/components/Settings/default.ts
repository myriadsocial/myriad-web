import {MenuOptions} from '../atoms/DropdownMenu';

import {LanguageSettingType, PrivacyType} from 'src/interfaces/setting';

export const accountPrivacyOptions: MenuOptions<PrivacyType>[] = [
  {
    id: 'private',
    title: 'Private',
  },
  {
    id: 'public',
    title: 'Public',
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
