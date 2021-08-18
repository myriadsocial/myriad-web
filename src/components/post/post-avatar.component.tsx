import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import {makeStyles, createStyles} from '@material-ui/core/styles';
import RedditIcon from '@material-ui/icons/Reddit';
import TwitterIcon from '@material-ui/icons/Twitter';

import {AvatarComponent} from 'src/components/common/Avatar.component';
import StyledBadge from 'src/components/common/Badge.component';
import {MyriadIcon} from 'src/components/common/MyriadIcon';
import FacebookIcon from 'src/images/facebook-svgrepo-com_1.svg';
import {PostOrigin} from 'src/interfaces/timeline';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      fontSize: 14,
    },
    avatar: {},
    facebook: {
      '& .MuiBadge-badge': {
        backgroundColor: '#3b5998',
      },
    },
    twitter: {
      '& .MuiBadge-badge': {
        backgroundColor: '#1DA1F2',
      },
    },
    reddit: {
      '& .MuiBadge-badge': {
        backgroundColor: '#FF5700',
      },
    },
    myriad: {
      '& .MuiBadge-badge': {
        backgroundColor: '#8629E9',
        overflow: 'hidden',
      },
    },
  }),
);

type Props = {
  origin: PostOrigin;
  avatar?: string;
  onClick: () => void;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function PostAvatar({origin, avatar, onClick}: Props) {
  const style = useStyles();

  const socials = React.useMemo(
    () => ({
      facebook: <FacebookIcon />,
      twitter: <TwitterIcon />,
      reddit: <RedditIcon />,
      myriad: <MyriadIcon />,
    }),
    [],
  );

  return (
    <IconButton aria-label="avatar-icon" onClick={onClick}>
      <StyledBadge badgeContent={socials[origin]} className={style[origin]} color="default">
        <AvatarComponent className={style.avatar} aria-label="avatar" src={avatar} />
      </StyledBadge>
    </IconButton>
  );
}
