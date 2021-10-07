import {PostVisibility} from '../../interfaces/post';
import {TagOptions} from '../PostTag';
import {MenuOptions} from '../atoms/DropdownMenu';

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
    title: 'Public',
  },
  {
    id: PostVisibility.FRIEND,
    title: 'Friend Only',
  },
  {
    id: PostVisibility.PRIVATE,
    title: 'Only Me',
  },
];
