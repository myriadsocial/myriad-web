import {MenuOptions} from '../atoms/DropdownMenu';

import {PrivacyType} from 'src/interfaces/setting';

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
