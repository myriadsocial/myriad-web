import React from 'react';

import {SvgIcon} from '@material-ui/core';
// TODO change Avatar to tumbnail size
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';

import FacebookIcon from '../../../../images/Icons/facebook.svg';
import RedditIcon from '../../../../images/Icons/reddit.svg';
import TwitterIcon from '../../../../images/Icons/twitter.svg';
import {MyriadIcon} from '../../../common/MyriadIcon';
import StyledBadge from '../Badge.component';
import {Props} from './post-avatar.interface';
import {useStyles} from './post-avatar.style';

import {acronym} from 'src/helpers/string';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function PostAvatar({origin, avatar, name, onClick}: Props) {
  const style = useStyles();

  const socials = React.useMemo(
    () => ({
      facebook: (
        <SvgIcon viewBox="0 0 20 20">
          <FacebookIcon />
        </SvgIcon>
      ),
      twitter: (
        <SvgIcon viewBox="0 0 20 20">
          <TwitterIcon />
        </SvgIcon>
      ),
      reddit: (
        <SvgIcon viewBox="0 0 20 20">
          <RedditIcon />
        </SvgIcon>
      ),
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
