import {Sizes} from '../../../interfaces/assets';

export type ImageListItemProps = {
  src: string;
  sizes: Sizes;
  rows: number;
  cols: number;
  loading: boolean;
};

export type ImageListProps = {
  cols: number;
  cellHeight: number;
  images: ImageListItemProps[];
};

export type GalleryType = 'vertical' | 'horizontal';
