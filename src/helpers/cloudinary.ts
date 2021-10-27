import {Sizes} from '../interfaces/assets';

const CLOUDINARY_BASE_URL = 'https://res.cloudinary.com';

export const generateImageSizes = (url: string, cloudName: string, extension = 'jpg'): Sizes => {
  const external = !url.includes(CLOUDINARY_BASE_URL);
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
    thumbnail: `${CLOUDINARY_BASE_URL}/${cloudName}/${prefix}/w_150,h_150,c_thumb/${filepath}`,
    small: `${CLOUDINARY_BASE_URL}/${cloudName}/${prefix}/w_400,h_400,c_fill,g_auto/${filepath}`,
    medium: `${CLOUDINARY_BASE_URL}/${cloudName}/${prefix}/w_800,h_800,c_fill,g_auto/${filepath}`,
    large: `${CLOUDINARY_BASE_URL}/${cloudName}/${prefix}/w_1200,c_fill/${filepath}`,
  };
};
