// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import { User } from 'path/to/interfaces';

export enum SocialsEnum {
  FACEBOOK = 'facebook',
  TWITTER = 'twitter',
  REDDIT = 'reddit'
}

export type User = {
  name: string;
  avatar: string;
};

export type Replies = {
  text: string;
  user: User;
};

export type Post = {
  text: string;
  user: User;
  images?: ImageData[];
  videos?: string[];
  replies?: Replies[];
};

export type ImageData = {
  src: string;
  title: string;
  width: number;
  height: number;
};
