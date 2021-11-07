// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import { User } from 'path/to/interfaces';

export enum SocialsEnum {
  FACEBOOK = 'facebook',
  TWITTER = 'twitter',
  REDDIT = 'reddit',
  TELEGRAM = 'telegram',
}

export type SocialsEnumType = typeof SocialsEnum;

export type LoopbackParams = {
  limit: number;
  offset: number;
  [key: string]: number | string | Record<string, string>;
};
