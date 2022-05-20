import {TagOptions} from 'src/components/PostTag';
import i18n from 'src/locale';

export const tagOptions: TagOptions[] = [
  {
    id: 'nudity',
    title: i18n.t('Post_Create.NSFW.Nudity'),
  },
  {
    id: 'pornography',
    title: i18n.t('Post_Create.NSFW.Pornography'),
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
    id: 'race_religion',
    title: i18n.t('Post_Create.NSFW.Race_and_Religion'),
  },
  {
    id: 'other',
    title: i18n.t('Post_Create.NSFW.Other'),
  },
];
