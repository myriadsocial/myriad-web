import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import {CustomAvatarProps, CustomAvatarSize} from './';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    small: {
      width: theme.spacing(3.75),
      height: theme.spacing(3.75),
    },
    medium: {
      width: theme.spacing(6),
      height: theme.spacing(6),
    },
    large: {
      width: theme.spacing(9),
      height: theme.spacing(9),
    },
  }),
);

const CustomAvatar = ({
  avatar,
  variant = 'circle',
  size = CustomAvatarSize.SMALL,
}: CustomAvatarProps): JSX.Element => {
  const styles = useStyles();
  return (
    <>
      {avatar && (
        <Avatar alt="Remy Sharp" src={avatar} variant={variant} className={styles[size]} />
      )}
    </>
  );
};

export default CustomAvatar;
