import {UserIcon} from '@heroicons/react/solid';

import React from 'react';

import {Avatar as BaseAvatar, SvgIcon} from '@material-ui/core';

import {AvatarProps} from './Avatar.interfaces';
import {useStyles} from './Avatar.style';

import {getThumbnailUrl} from 'src/helpers/image';
import {acronym} from 'src/helpers/string';

export const Avatar: React.FC<AvatarProps> = props => {
  const {src, name, variant = 'circular', banned = false, ...restProps} = props;

  const styles = useStyles({...restProps, banned});

  const url = src ? getThumbnailUrl(src) : src;

  return (
    <>
      <BaseAvatar className={styles.root} src={url} variant={variant} {...restProps}>
        {name ? acronym(name) : <SvgIcon component={UserIcon} viewBox="0 0 20 20" />}
      </BaseAvatar>
    </>
  );
};

export default Avatar;
