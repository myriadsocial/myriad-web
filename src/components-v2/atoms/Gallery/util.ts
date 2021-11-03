import {ImageList, ImageListItem, GalleryType} from './Gallery.types';

import {generateImageSizes} from 'src/helpers/cloudinary';

export const buildList = (source: string[], variant: GalleryType, cloudName: string): ImageList => {
  let listCols = 1;
  let itemCols = 1;
  let ROWS = 1;
  let cellHeight = 320;

  const images: ImageListItem[] = [];

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
    cellHeight: cellHeight,
    images,
  };
};
