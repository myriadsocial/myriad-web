import {User} from '../../../../interfaces/user';

export type PostSubHeaderProps = {
  postId: string;
  platform: string;
  date: Date;
  importers?: User[];
  url: string;
};
