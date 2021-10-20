import {MenuOptions} from '../atoms/DropdownMenu';

export type PrivacyOptions = 'private' | 'public';

export const accountPrivacyOptions: MenuOptions<PrivacyOptions>[] = [
  {
    id: 'private',
    title: 'Private',
  },
  {
    id: 'public',
    title: 'Public',
  },
];
