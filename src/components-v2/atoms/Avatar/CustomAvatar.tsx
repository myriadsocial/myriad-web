import React from 'react';

import Avatar from '@material-ui/core/Avatar';

import {CustomAvatarProps, CustomAvatarSize, useStyles} from '.';

import {acronym} from 'src/helpers/string';

const CustomAvatar = ({
  avatar,
  variant = 'circular',
  size = CustomAvatarSize.SMALL,
  name,
  ...restProps
}: CustomAvatarProps): JSX.Element => {
  const styles = useStyles();
  return (
    <>
      {(avatar || name) && (
        <Avatar {...restProps} src={avatar} variant={variant} className={styles[size]}>
          {name ? acronym(name) : ''}
        </Avatar>
      )}
    </>
  );
};

export default CustomAvatar;
