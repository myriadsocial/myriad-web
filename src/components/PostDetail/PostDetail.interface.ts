import {PostHeaderActionProps} from './render/Header';

import {Post, PostMetric} from 'src/interfaces/post';
import {User} from 'src/interfaces/user';

export type PostDetailActionProps = PostHeaderActionProps & {
  onUpvote: (post: Post) => void;
  onToggleDownvote: (post: Post) => void;
  onRemoveVote: (post: Post) => void;
  onToggleShowComment: () => void;
};

export type PostDetailProps = PostDetailActionProps & {
  user: User;
  post: Post;
  // trigger variable for rerender post detail
  type?: 'share' | 'default';
  expand?: boolean;
};

export type PostDetailContainerProps = {
  user: User;
  post: Post;
  // trigger variable for rerender post detail
  type?: 'share' | 'default';
  metric: PostMetric;
  expand?: boolean;
};
