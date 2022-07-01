import {PostSubheaderActionProps} from '../SubHeader';

import {Post} from 'src/interfaces/post';
import {User} from 'src/interfaces/user';

export type PostHeaderActionProps = PostSubheaderActionProps & {
  onDelete: () => void;
  onOpenTipHistory: () => void;
  onReport: () => void;
  onChangeVisibility: () => void;
};

export type PostHeaderProps = PostHeaderActionProps & {
  user: User;
  post: Post;
  owned: boolean;
};
