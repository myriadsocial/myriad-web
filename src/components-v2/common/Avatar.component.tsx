// DIPAKAI
import React from 'react';

import getConfig from 'next/config';

import Avatar, {AvatarProps} from '@material-ui/core/Avatar';

import {generateImageSizes} from 'src/helpers/cloudinary';

type AvatarComponentProps = AvatarProps;

export const AvatarComponent: React.FC<AvatarComponentProps> = props => {
  const {src, ...restProps} = props;

  const {publicRuntimeConfig} = getConfig();
  let thumbnailUrl = src;

  if (src) {
    const sizes = generateImageSizes(src, publicRuntimeConfig.cloudinaryName);

    thumbnailUrl = sizes.thumbnail;
  }

  return <Avatar {...restProps} src={thumbnailUrl} />;
};
