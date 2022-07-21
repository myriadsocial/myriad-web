import getConfig from 'next/config';

import {Sizes} from 'src/interfaces/assets';

const STORAGE_BASE_URL = 'https://storage.googleapis.com';

export const generateImageSizes = (url: string | Sizes, extension = 'jpg'): Sizes => {
  const {publicRuntimeConfig} = getConfig();

  if (typeof url === 'object') {
    return {
      thumbnail: url.thumbnail,
      small: url.small,
      medium: url.medium,
      large: url.large,
    };
  }

  const external = !url.includes(publicRuntimeConfig.firebaseStorageBucket);
  const filename = url.split(/[\\/]/).pop();

  if (!filename || external) {
    return {
      thumbnail: url,
      small: url,
      medium: url,
      large: url,
    };
  }

  const fileId = filename.split('.').slice(0, -1).join('.');
  const pathname = url.replace(STORAGE_BASE_URL, '').replace(filename, '');

  return {
    thumbnail: `${STORAGE_BASE_URL}${pathname}${fileId}_thumbnail.${extension}`,
    small: `${STORAGE_BASE_URL}${pathname}${fileId}_small.${extension}`,
    medium: `${STORAGE_BASE_URL}${pathname}${fileId}_medium.${extension}`,
    large: `${STORAGE_BASE_URL}${pathname}${fileId}.${extension}`,
  };
};

export const getThumbnailUrl = (url: string): string => {
  const images = generateImageSizes(url);

  return images.thumbnail;
};
