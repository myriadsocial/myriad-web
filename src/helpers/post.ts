import {Post} from 'src/interfaces/post';
import {User} from 'src/interfaces/user';

export const isOwnPost = (post: Post, user?: User) => {
  if (!user) return false;

  return post.platform === 'myriad' && post.createdBy === user.id;
};
