import {Sizes} from '../../../interfaces/assets';

export type ImageListItem = {
  src: string;
  sizes: Sizes;
  rows: number;
  cols: number;
};

export type ImageList = {
  cols: number;
  cellHeight: number;
  images: ImageListItem[];
};
