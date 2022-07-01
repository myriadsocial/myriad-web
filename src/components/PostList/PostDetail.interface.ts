import {PostHeaderActionProps} from './render/Header';

import {Post} from 'src/interfaces/post';
import {User} from 'src/interfaces/user';

export type PostDetailActionProps = PostHeaderActionProps & {
  onUpvote: (post: Post) => void;
  onShare: (post: Post) => void;
  onToggleDownvote: (post: Post) => void;
  onRemoveVote: (post: Post) => void;
  onShowComment: () => void;
};

export type PostDetailProps = PostDetailActionProps & {
  user: User;
  post: Post;
  // trigger variable for rerender post detail
  votes: number;
};

export type PostDetailContainerProps = Omit<PostDetailProps, 'onShowComment'>;
