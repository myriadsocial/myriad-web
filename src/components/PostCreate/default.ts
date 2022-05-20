import {PostVisibility} from '../../interfaces/post';
import {TagOptions} from '../PostTag';
import {MenuOptions} from '../atoms/DropdownMenu';

import i18n from 'src/locale';

export const tagOptions: TagOptions[] = [
  {
    id: 'violent',
    title: 'Violent',
  },
  {
    id: 'profanity',
    title: 'Profanity',
  },
  {
    id: 'violence_gore',
    title: 'Violence and Gore',
  },
  {
    id: 'rage_religion',
    title: 'Race and Religion',
  },
  {
    id: 'pornography',
    title: 'Pornography',
  },
  {
    id: 'other',
    title: 'Other',
  },
];

export const menuOptions: MenuOptions<PostVisibility>[] = [
  {
    id: PostVisibility.PUBLIC,
    title: i18n.t('Post_Create.Visibility.Public'),
  },
  {
    id: PostVisibility.FRIEND,
    title: i18n.t('Post_Create.Visibility.Friend_Only'),
  },
  {
    id: PostVisibility.PRIVATE,
    title: i18n.t('Post_Create.Visibility.Only_Me'),
  },
];
