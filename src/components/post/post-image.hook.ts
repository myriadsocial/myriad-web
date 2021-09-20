import getConfig from 'next/config';

import {generateImageSizes} from 'src/helpers/cloudinary';
import {Sizes} from 'src/interfaces/assets';
import {PostOrigin} from 'src/interfaces/timeline';

type ImageListItem = {
  src: string;
  sizes: Sizes;
  rows: number;
  cols: number;
};

type ImageList = {
  cols: number;
  cellHeight: number;
  images: ImageListItem[];
};

export const useImageHooks = () => {
  const {publicRuntimeConfig} = getConfig();

  const buildList = (source: string[], platform: PostOrigin): ImageList => {
    let listCols = 1;
    let itemCols = 1;
    let ROWS = 1;
    let cellHeight = 300;

    const images: ImageListItem[] = [];

    for (let index = 0; index < source.length; index++) {
      if (source.length > 1) {
        listCols = 2;
        itemCols = 2;
      }

      if (source.length >= 3) {
        listCols = 6;
        cellHeight = 200;
        ROWS = index === 0 ? 2 : 1;
        itemCols = index === 0 ? listCols : listCols / Math.min(source.length - 1, 3);
      }

      images.push({
        cols: itemCols,
        rows: ROWS,
        src: source[index],
        sizes: generateImageSizes(source[index], publicRuntimeConfig.cloudinaryName),
      });
    }

    return {
      cols: listCols,
      cellHeight: cellHeight,
      images,
    };
  };

  return {
    buildList,
  };
};
