import {Post} from '../../../interfaces/post';

export type PostHeaderProps = {
  owner: boolean;
  post: Post;
  tipped?: boolean;
  onDelete: () => void;
  onOpenTipHistory: () => void;
  onReport: () => void;
  onShared: () => void;
};

export enum Platform {
  twitter = 'twitter',
  myriad = 'myriad',
  reddit = 'reddit',
}
