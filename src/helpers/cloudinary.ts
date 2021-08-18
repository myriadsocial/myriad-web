import getConfig from 'next/config';

import {Sizes} from '../interfaces/assets';

const {publicRuntimeConfig} = getConfig();

const CLOUDINARY_BASE_URL = 'https://res.cloudinary.com';
const CLOUD_NAME = publicRuntimeConfig.cloudinaryName;

export const generateImageSizes = (url: string, external = false, extension = 'jpg'): Sizes => {
  const filename = url.split(/[\\/]/).pop();

  if (!filename)
    return {
      thumbnail: url,
      small: url,
      medium: url,
      large: url,
    };

  const cloudinaryId = filename.split('.').slice(0, -1).join('.');
  const filepath = external ? url : `${cloudinaryId}.${extension}`;
  const prefix = external ? 'image/fetch' : '';

  return {
    thumbnail: `${CLOUDINARY_BASE_URL}/${CLOUD_NAME}/${prefix}/w_150,h_150,c_thumb/${filepath}`,
    small: `${CLOUDINARY_BASE_URL}/${CLOUD_NAME}/${prefix}/w_400,c_limit/${filepath}`,
    medium: `${CLOUDINARY_BASE_URL}/${CLOUD_NAME}/${prefix}/w_800,c_limit/${filepath}`,
    large: `${CLOUDINARY_BASE_URL}/${CLOUD_NAME}/${prefix}/w_1200,c_limit/${filepath}`,
  };
};
