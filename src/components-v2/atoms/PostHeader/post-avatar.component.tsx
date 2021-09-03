import React from 'react';

// TODO change Avatar to tumbnail size
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import {makeStyles, createStyles} from '@material-ui/core/styles';
import RedditIcon from '@material-ui/icons/Reddit';
import TwitterIcon from '@material-ui/icons/Twitter';

import {MyriadIcon} from '../../../components/common/MyriadIcon';
import FacebookIcon from '../../../images/facebook-svgrepo-com_1.svg';
import {PostOrigin} from '../../../interfaces/timeline';
import StyledBadge from './Badge.component';

const useStyles = makeStyles(() =>
  createStyles({
    avatar: {
      width: 50,
      height: 50,
    },
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
    action: {
      padding: 0,
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
    <IconButton className={style.action} aria-label="avatar-icon" onClick={onClick}>
      <StyledBadge badgeContent={socials[origin]} className={style[origin]} color="default">
        <Avatar className={style.avatar} aria-label="avatar" src={avatar} />
      </StyledBadge>
    </IconButton>
  );
}
