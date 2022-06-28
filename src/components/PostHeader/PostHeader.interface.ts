import {Post} from 'src/interfaces/post';
import {User} from 'src/interfaces/user';

export type PostHeaderProps = {
  user?: User;
  owner: boolean;
  post: Post;
  tipped?: boolean;
  onDelete: () => void;
  onOpenTipHistory: () => void;
  onReport: () => void;
  onVisibility: () => void;
  onImporters: () => void;
  disableAction?: boolean;
};
