import {PostVisibility} from '../../interfaces/post';
import {TagOptions} from '../PostTag';
import {MenuOptions} from '../atoms/DropdownMenu';

import i18n from 'src/locale';

export const tagOptions: TagOptions[] = [
  {
    id: 'violent',
    title: i18n.t('Post_Create.NSFW.Violent'),
  },
  {
    id: 'profanity',
    title: i18n.t('Post_Create.NSFW.Profanity'),
  },
  {
    id: 'violence_gore',
    title: i18n.t('Post_Create.NSFW.Violence_and_Gore'),
  },
  {
    id: 'rage_religion',
    title: i18n.t('Post_Create.NSFW.Race_and_Religion'),
  },
  {
    id: 'pornography',
    title: i18n.t('Post_Create.NSFW.Pornography'),
  },
  {
    id: 'other',
    title: i18n.t('Post_Create.NSFW.Other'),
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
  {
    id: PostVisibility.CUSTOM,
    title: i18n.t('Visibilities.Custom'),
  },
];
