import React from 'react';

import IconButton from '@material-ui/core/IconButton';

import {Avatar, AvatarSize} from '../../Avatar';
import {FacebookIcon, MyriadCircleIcon, RedditIcon, TwitterIcon} from '../../Icons';
import StyledBadge from '../Badge.component';
import {Props} from './post-avatar.interface';
import {useStyles} from './post-avatar.style';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function PostAvatar({origin, avatar, name, onClick}: Props) {
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
      <StyledBadge badgeContent={socials[origin]} className={style[origin]} color="default">
        <Avatar aria-label="avatar" src={avatar} name={name} size={AvatarSize.MEDIUM} />
      </StyledBadge>
    </IconButton>
  );
}
