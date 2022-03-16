import {AvatarProps as BaseAvatarProps} from '@material-ui/core/Avatar';

export enum AvatarSize {
  TINY = 'tiny',
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

export type AvatarProps = BaseAvatarProps & {
  url?: string;
  size?: AvatarSize;
  name?: string;
  deleted?: boolean;
  banned?: boolean;
};
