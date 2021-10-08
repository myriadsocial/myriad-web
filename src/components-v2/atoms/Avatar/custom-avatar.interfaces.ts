import {AvatarProps} from '@material-ui/core/Avatar';

enum CustomAvatarSize {
  XSMALL = 'xtraSmall',
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

interface CustomAvatarProps extends AvatarProps {
  avatar?: string;
  size?: CustomAvatarSize;
  name?: string;
}

export {CustomAvatarSize};
export type {CustomAvatarProps};
