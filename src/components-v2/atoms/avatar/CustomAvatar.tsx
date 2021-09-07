import React from 'react';

import Avatar from '@material-ui/core/Avatar';

import {CustomAvatarProps, CustomAvatarSize, useStyles} from './';

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
