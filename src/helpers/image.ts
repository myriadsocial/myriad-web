import { Sizes } from 'src/interfaces/assets';

export const generateImageSizes = (url: string | Sizes): Sizes => {
  // Image klo di generate menjadi object
  if (typeof url === 'object') {
    return {
      thumbnail: url.thumbnail,
      small: url.small,
      medium: url.medium,
      large: url.large,
    };
  }

  // Image dari source manapun
  return {
    thumbnail: url,
    small: url,
    medium: url,
    large: url,
  };
};

export const getThumbnailUrl = (url: string): string => {
  const images = generateImageSizes(url);

  return images.thumbnail;
};
