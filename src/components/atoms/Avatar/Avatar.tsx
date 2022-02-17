import React from 'react';

import {Avatar as BaseAvatar} from '@material-ui/core';

import {AvatarProps, AvatarSize} from './Avatar.interfaces';
import {useStyles} from './Avatar.style';

import {getThumbnailUrl} from 'src/helpers/image';
import {acronym} from 'src/helpers/string';

export const Avatar: React.FC<AvatarProps> = props => {
  const {src, variant = 'circular', size = AvatarSize.SMALL, name, ...restProps} = props;

  const styles = useStyles();

  const url = src ? getThumbnailUrl(src) : src;

  return (
    <>
      <BaseAvatar src={url} variant={variant} className={styles[size]} {...restProps}>
        {name ? acronym(name) : ''}
      </BaseAvatar>
    </>
  );
};

export default Avatar;
