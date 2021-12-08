import {ImageListProps, ImageListItemProps, GalleryType} from './Gallery.types';

import {generateImageSizes} from 'src/helpers/cloudinary';

const horizontalGallery = (source: string[], cloudName: string): ImageListProps => {
  let listCols = 1;
  let itemCols = 1;
  let ROWS = 1;
  let cellHeight = 320;

  const images: ImageListItemProps[] = [];

  for (let index = 0; index < source.length; index++) {
    if (source.length > 1) {
      listCols = 2;
      itemCols = 2;
    }

    if (source.length >= 3) {
      listCols = 6;
      cellHeight = 160;
      ROWS = index === 0 ? 2 : 1;
      itemCols = index === 0 ? listCols : listCols / Math.min(source.length - 1, 3);
    }

    const sizes = generateImageSizes(source[index], cloudName);

    images.push({
      cols: itemCols,
      rows: ROWS,
      src: ROWS === 1 ? sizes.small : sizes.medium,
      sizes: sizes,
      loading: true,
    });
  }

  return {
    cols: listCols,
    cellHeight,
    images,
  };
};

const verticalGallery = (source: string[], cloudName: string): ImageListProps => {
  let listCols = 1;
  let ROWS = 1;
  let cellHeight = 320;

  const images: ImageListItemProps[] = [];

  for (let index = 0; index < source.length; index++) {
    if (source.length > 1) {
      listCols = 2;
    }

    if (source.length >= 2) {
      cellHeight = 162;
      ROWS = index === 0 ? 2 : 1;
    }

    const sizes = generateImageSizes(source[index], cloudName);

    images.push({
      cols: 1,
      rows: ROWS,
      src: ROWS === 1 ? sizes.small : sizes.medium,
      sizes: sizes,
      loading: true,
    });
  }

  return {
    cols: listCols,
    cellHeight,
    images,
  };
};

export const buildList = (
  source: string[],
  variant: GalleryType,
  cloudName: string,
): ImageListProps => {
  switch (variant) {
    case 'horizontal':
      return horizontalGallery(source, cloudName);
    default:
      return verticalGallery(source, cloudName);
  }
};
