import React from 'react';

// TODO change Avatar to tumbnail size
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';

import {MyriadIcon} from '../../../common/MyriadIcon';
import {FacebookIcon, RedditIcon, TwitterIcon} from '../../Icons';
import StyledBadge from '../Badge.component';
import {Props} from './post-avatar.interface';
import {useStyles} from './post-avatar.style';

import {acronym} from 'src/helpers/string';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function PostAvatar({origin, avatar, name, onClick}: Props) {
  const style = useStyles();

  const socials = React.useMemo(
    () => ({
      facebook: FacebookIcon,
      twitter: TwitterIcon,
      reddit: RedditIcon,
      myriad: <MyriadIcon />,
    }),
    [],
  );

  return (
    <IconButton className={style.action} aria-label="avatar-icon" onClick={onClick}>
      <StyledBadge badgeContent={socials[origin]} className={style[origin]} color="default">
        <Avatar className={style.avatar} aria-label="avatar" src={avatar}>
          {acronym(name)}
        </Avatar>
      </StyledBadge>
    </IconButton>
  );
}
