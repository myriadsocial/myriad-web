import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import FacebookIcon from '@material-ui/icons/Facebook';
import RedditIcon from '@material-ui/icons/Reddit';
import TwitterIcon from '@material-ui/icons/Twitter';

import { PostOrigin } from '../../../interfaces/post';
import StyledBadge from '../../common/Badge.component';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      fontSize: 14
    },
    avatar: {
      backgroundColor: '#E849BD'
    },
    facebook: {
      '& .MuiBadge-badge': {
        backgroundColor: '#3b5998'
      }
    },
    twitter: {
      '& .MuiBadge-badge': {
        backgroundColor: '#1DA1F2'
      }
    },
    reddit: {
      '& .MuiBadge-badge': {
        backgroundColor: '#FF5700'
      }
    }
  })
);

type Props = {
  origin: PostOrigin;
  avatar: string;
  onClick: () => void;
};

export default function PostAvatar({ origin, avatar, onClick }: Props) {
  const style = useStyles();

  const socials = React.useMemo(
    () => ({
      facebook: <FacebookIcon />,
      twitter: <TwitterIcon />,
      reddit: <RedditIcon />
    }),
    []
  );

  return (
    <IconButton aria-label="avatar-icon" onClick={onClick}>
      <StyledBadge badgeContent={socials[origin]} className={style[origin]} color="default">
        <Avatar className={style.avatar} aria-label="avatar" src={avatar} />
      </StyledBadge>
    </IconButton>
  );
}
