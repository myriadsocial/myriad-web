import {Post} from '../../../interfaces/post';

export type PostComponentProps = {
  disable?: boolean;
  post: Post;
};

export enum Platform {
  twitter = 'twitter',
  myriad = 'myriad',
  reddit = 'reddit',
}
