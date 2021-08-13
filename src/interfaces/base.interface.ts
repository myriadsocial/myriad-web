import {Sizes} from './assets';

export interface BaseModel {
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface ImageSizes {
  sizes: Sizes;
}
