import React from 'react';

import IconButton from '@material-ui/core/IconButton';

import {Badge} from '../Badge';
import {SocialAvatarProps} from './SocialAvatar.interface';
import {useStyles} from './SocialAvatar.style';

import {Avatar, AvatarSize} from 'src/components/atoms/Avatar';
import {FacebookIcon, MyriadCircleIcon, RedditIcon, TwitterIcon} from 'src/components/atoms/Icons';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const SocialAvatar: React.FC<SocialAvatarProps> = ({origin, avatar, name, onClick}) => {
  const style = useStyles();

  const socials = React.useMemo(
    () => ({
      facebook: FacebookIcon,
      twitter: TwitterIcon,
      reddit: RedditIcon,
      myriad: <MyriadCircleIcon />,
    }),
    [],
  );

  return (
    <IconButton className={style.action} aria-label="avatar-icon" onClick={onClick}>
      <Badge badgeContent={socials[origin]} className={style[origin]} color="default">
        <Avatar aria-label="avatar" src={avatar} name={name} size={AvatarSize.MEDIUM} />
      </Badge>
    </IconButton>
  );
};
