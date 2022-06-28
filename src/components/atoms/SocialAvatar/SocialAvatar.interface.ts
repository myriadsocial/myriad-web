import {PostOrigin} from 'src/interfaces/timeline';

export type SocialAvatarProps = {
  origin: PostOrigin;
  avatar?: string;
  name: string;
  onClick: () => void;
};
